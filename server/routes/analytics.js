const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const StudySession = require('../models/StudySession');
const User = require('../models/User');
const Course = require('../models/Course');

// Track a new study session
router.post('/session/start', authMiddleware(['student']), async (req, res) => {
  try {
    const {
      materialId,
      courseId,
      studyMode,
      availableTime,
      characterUsed,
      language
    } = req.body;

    const session = new StudySession({
      student: req.user._id,
      material: materialId,
      course: courseId,
      studyMode: studyMode || 'medium',
      availableTime: availableTime || 30,
      characterUsed: characterUsed || 'Professor Alex',
      language: language || 'en',
      startedAt: new Date()
    });

    await session.save();

    res.json({
      success: true,
      sessionId: session._id,
      message: 'Study session started'
    });
  } catch (error) {
    console.error('Error starting study session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update study session with progress
router.put('/session/:sessionId', authMiddleware(['student']), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const {
      timeSpent,
      completionPercentage,
      performanceScore,
      questionsAnswered,
      questionsCorrect,
      usedVoiceNarration,
      needsReview,
      notes
    } = req.body;

    const session = await StudySession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update session data
    if (timeSpent !== undefined) session.timeSpent = timeSpent;
    if (completionPercentage !== undefined) session.completionPercentage = completionPercentage;
    if (performanceScore !== undefined) session.performanceScore = performanceScore;
    if (questionsAnswered !== undefined) session.questionsAnswered = questionsAnswered;
    if (questionsCorrect !== undefined) session.questionsCorrect = questionsCorrect;
    if (usedVoiceNarration !== undefined) session.usedVoiceNarration = usedVoiceNarration;
    if (needsReview !== undefined) session.needsReview = needsReview;
    if (notes !== undefined) session.notes = notes;

    session.completedAt = new Date();
    await session.save();

    // Update user's total study time
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalStudyTime: timeSpent || 0 },
      lastStudySession: new Date()
    });

    res.json({
      success: true,
      session,
      message: 'Study session updated'
    });
  } catch (error) {
    console.error('Error updating study session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get student's analytics
router.get('/student/me', authMiddleware(['student']), async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all sessions for this student
    const sessions = await StudySession.find({ student: studentId })
      .populate('course', 'title')
      .populate('material', 'title')
      .sort({ startedAt: -1 });

    // Calculate analytics
    const totalSessions = sessions.length;
    const totalStudyTime = sessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
    const averageSessionTime = totalSessions > 0 ? (totalStudyTime / totalSessions) : 0;

    // Character usage stats
    const characterStats = {};
    sessions.forEach(session => {
      const char = session.characterUsed || 'None';
      characterStats[char] = (characterStats[char] || 0) + 1;
    });

    // Narration usage
    const narrationSessions = sessions.filter(s => s.usedVoiceNarration).length;
    const narrationUsageRate = totalSessions > 0 ? (narrationSessions / totalSessions * 100) : 0;

    // Study mode preferences
    const modeStats = {};
    sessions.forEach(session => {
      const mode = session.studyMode;
      modeStats[mode] = (modeStats[mode] || 0) + 1;
    });

    // Performance metrics
    const completedSessions = sessions.filter(s => s.completedAt);
    const averageCompletion = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.completionPercentage || 0), 0) / completedSessions.length
      : 0;

    const performanceSessions = sessions.filter(s => s.performanceScore);
    const averagePerformance = performanceSessions.length > 0
      ? performanceSessions.reduce((sum, s) => sum + s.performanceScore, 0) / performanceSessions.length
      : 0;

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessions = sessions.filter(s => new Date(s.startedAt) > sevenDaysAgo);

    // Study streak (consecutive days)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasSession = sessions.some(s => {
        const sessionDate = new Date(s.startedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });
      
      if (hasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    res.json({
      success: true,
      analytics: {
        totalSessions,
        totalStudyTime,
        averageSessionTime: Math.round(averageSessionTime),
        characterStats,
        favoriteCharacter: Object.keys(characterStats).reduce((a, b) => 
          characterStats[a] > characterStats[b] ? a : b, 'None'),
        narrationUsageRate: Math.round(narrationUsageRate),
        narrationSessions,
        modeStats,
        preferredMode: Object.keys(modeStats).reduce((a, b) => 
          modeStats[a] > modeStats[b] ? a : b, 'medium'),
        averageCompletion: Math.round(averageCompletion),
        averagePerformance: Math.round(averagePerformance),
        recentActivity: recentSessions.length,
        studyStreak: streak,
        recentSessions: recentSessions.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get teacher's course analytics
router.get('/teacher/course/:courseId', authMiddleware(['teacher']), async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify teacher owns the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get all sessions for this course
    const sessions = await StudySession.find({ course: courseId })
      .populate('student', 'name email')
      .populate('material', 'title')
      .sort({ startedAt: -1 });

    // Calculate analytics
    const uniqueStudents = [...new Set(sessions.map(s => s.student._id.toString()))];
    const totalStudents = uniqueStudents.length;
    const totalSessions = sessions.length;

    // Character popularity
    const characterStats = {};
    sessions.forEach(session => {
      const char = session.characterUsed || 'None';
      characterStats[char] = (characterStats[char] || 0) + 1;
    });

    // Narration adoption rate
    const narrationSessions = sessions.filter(s => s.usedVoiceNarration).length;
    const narrationAdoption = totalSessions > 0 ? (narrationSessions / totalSessions * 100) : 0;

    // Average engagement
    const avgCompletion = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.completionPercentage || 0), 0) / sessions.length
      : 0;

    // Student engagement levels
    const studentEngagement = uniqueStudents.map(studentId => {
      const studentSessions = sessions.filter(s => s.student._id.toString() === studentId);
      const totalTime = studentSessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
      const usedNarration = studentSessions.some(s => s.usedVoiceNarration);
      
      return {
        student: studentSessions[0].student,
        sessionCount: studentSessions.length,
        totalTime,
        usedNarration,
        lastSession: studentSessions[0].startedAt
      };
    }).sort((a, b) => b.sessionCount - a.sessionCount);

    res.json({
      success: true,
      analytics: {
        totalStudents,
        totalSessions,
        characterStats,
        mostPopularCharacter: Object.keys(characterStats).reduce((a, b) => 
          characterStats[a] > characterStats[b] ? a : b, 'None'),
        narrationAdoption: Math.round(narrationAdoption),
        averageCompletion: Math.round(avgCompletion),
        studentEngagement: studentEngagement.slice(0, 20),
        recentSessions: sessions.slice(0, 20)
      }
    });
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
