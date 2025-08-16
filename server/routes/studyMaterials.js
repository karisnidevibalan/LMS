const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const StudyMaterial = require('../models/StudyMaterial');
const { extractKeywordsFromFile, enhanceKeywords } = require('../utils/keywordExtractor');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/study-materials');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow documents, images, videos, audio files
    const allowedTypes = /\.(pdf|doc|docx|ppt|pptx|txt|md|jpg|jpeg|png|gif|mp4|avi|mkv|mp3|wav)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOC, PPT, images, videos, audio files'));
    }
  }
});

// Upload study material for a course (teacher only)
router.post('/upload/:courseId', authMiddleware(['teacher']), upload.single('file'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, chapter, difficulty, studyTime, keywords } = req.body;

    // Verify course belongs to teacher
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only upload materials for your own courses' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract keywords automatically from the file
    let extractedKeywords = [];
    try {
      console.log('Extracting keywords from file:', req.file.originalname);
      extractedKeywords = await extractKeywordsFromFile(req.file.path, req.file.originalname);
      
      // Enhance keywords with course and file context
      extractedKeywords = enhanceKeywords(extractedKeywords, req.file.originalname, course.title);
      
      console.log('Auto-extracted keywords:', extractedKeywords);
    } catch (error) {
      console.warn('Keyword extraction failed, using manual keywords only:', error.message);
    }

    // Combine manual keywords (if provided) with extracted keywords
    const manualKeywords = keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : [];
    const allKeywords = [...new Set([...extractedKeywords, ...manualKeywords])]; // Remove duplicates

    const studyMaterial = new StudyMaterial({
      courseId,
      teacherId: req.user._id,
      title,
      description,
      chapter,
      difficulty: difficulty || 'medium',
      estimatedStudyTime: studyTime || 30,
      keywords: allKeywords,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      uploadDate: new Date()
    });

    await studyMaterial.save();

    res.status(201).json({
      message: 'Study material uploaded successfully',
      material: studyMaterial,
      autoExtractedKeywords: extractedKeywords,
      totalKeywords: allKeywords.length
    });

  } catch (error) {
    console.error('Error uploading study material:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all study materials for a course (enrolled students + teacher)
router.get('/course/:courseId', authMiddleware(['student', 'teacher']), async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is enrolled or is the teacher with optimized query
    const course = await Course.findById(courseId).select('teacherId enrolledStudents').lean();
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isTeacher = course.teacherId.toString() === req.user._id.toString();
    const isEnrolled = course.enrolledStudents.includes(req.user._id);

    if (!isTeacher && !isEnrolled) {
      return res.status(403).json({ error: 'You must be enrolled in this course to access materials' });
    }

    // Optimized query with lean() for better performance
    const materials = await StudyMaterial.find({ courseId })
      .populate('teacherId', 'name email')
      .select('-filePath') // Don't expose file path for security
      .sort({ chapter: 1, uploadDate: 1 })
      .lean();

    res.json(materials);

  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download study material file (enrolled students + teacher)
router.get('/download/:materialId', authMiddleware(['student', 'teacher']), async (req, res) => {
  try {
    const { materialId } = req.params;
    const { view } = req.query; // Check if this is for viewing vs downloading

    const material = await StudyMaterial.findById(materialId).populate('courseId');
    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Check access permissions
    const course = material.courseId;
    const isTeacher = course.teacherId.toString() === req.user._id.toString();
    const isEnrolled = course.enrolledStudents.includes(req.user._id);

    if (!isTeacher && !isEnrolled) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(material.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Get MIME type based on file extension
    const getContentType = (fileName) => {
      const ext = path.extname(fileName).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mkv': 'video/x-matroska',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav'
      };
      return mimeTypes[ext] || 'application/octet-stream';
    };

    // Set appropriate headers based on whether viewing or downloading
    if (view === 'true') {
      // For viewing in browser
      const contentType = getContentType(material.fileName);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${material.fileName}"`);
    } else {
      // For downloading
      res.setHeader('Content-Disposition', `attachment; filename="${material.fileName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
    }

    // Stream the file
    const fileStream = fs.createReadStream(material.filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI-generated study content based on time constraint
router.post('/ai-content/:materialId', authMiddleware(['student']), async (req, res) => {
  try {
    const { materialId } = req.params;
    const { studyMode, timeAvailable, language } = req.body; // quick, medium, detailed

    const material = await StudyMaterial.findById(materialId).populate('courseId');
    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Check enrollment
    const course = material.courseId;
    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    if (!isEnrolled) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate AI content based on study mode
    let aiContent = {
      mode: studyMode,
      timeAvailable,
      language: language || 'en'
    };

    switch (studyMode) {
      case 'quick':
        aiContent.content = {
          summary: `Quick summary of ${material.title}`,
          keyPoints: material.keywords.slice(0, 5),
          estimatedTime: '5-10 minutes',
          flashcards: material.keywords.map(keyword => ({
            front: keyword,
            back: `Definition and importance of ${keyword}`
          }))
        };
        break;

      case 'medium':
        aiContent.content = {
          summary: `Detailed explanation of ${material.title}`,
          keyPoints: material.keywords,
          estimatedTime: '15-30 minutes',
          sections: [
            { title: 'Introduction', content: 'Overview of the topic' },
            { title: 'Main Concepts', content: 'Detailed explanation' },
            { title: 'Examples', content: 'Practical examples' },
            { title: 'Summary', content: 'Key takeaways' }
          ],
          quiz: [
            { question: 'What is the main concept?', options: ['A', 'B', 'C', 'D'], correct: 0 }
          ]
        };
        break;

      case 'detailed':
        aiContent.content = {
          summary: `Comprehensive study guide for ${material.title}`,
          keyPoints: material.keywords,
          estimatedTime: '45-60 minutes',
          sections: [
            { title: 'Introduction', content: 'Comprehensive overview' },
            { title: 'Detailed Concepts', content: 'In-depth explanation' },
            { title: 'Visual Examples', content: 'Diagrams and illustrations' },
            { title: 'Interactive Elements', content: 'Simulations and animations' },
            { title: 'Practice Exercises', content: 'Hands-on activities' },
            { title: 'Assessment', content: 'Comprehensive quiz' }
          ],
          multimedia: [
            { type: 'video', url: '/placeholder-video.mp4', description: 'Animated explanation' },
            { type: 'interactive', url: '/placeholder-simulation', description: 'Interactive simulation' }
          ],
          quiz: [
            { question: 'Detailed question 1', options: ['A', 'B', 'C', 'D'], correct: 0 },
            { question: 'Detailed question 2', options: ['A', 'B', 'C', 'D'], correct: 1 }
          ]
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid study mode' });
    }

    res.json(aiContent);

  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Translate content to different language
router.post('/translate/:materialId', authMiddleware(['student']), async (req, res) => {
  try {
    const { materialId } = req.params;
    const { targetLanguage, content } = req.body;

    const material = await StudyMaterial.findById(materialId).populate('courseId');
    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Check enrollment
    const course = material.courseId;
    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    if (!isEnrolled) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Mock translation (in real app, integrate with Google Translate API or similar)
    const translatedContent = {
      originalLanguage: 'en',
      targetLanguage,
      translated: {
        title: `[${targetLanguage.toUpperCase()}] ${material.title}`,
        description: `[${targetLanguage.toUpperCase()}] ${material.description}`,
        content: content ? `[${targetLanguage.toUpperCase()}] ${content}` : null
      }
    };

    res.json(translatedContent);

  } catch (error) {
    console.error('Error translating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete study material (teacher only)
router.delete('/:materialId', authMiddleware(['teacher']), async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Check if material belongs to teacher
    if (material.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own materials' });
    }

    // Delete file from filesystem
    if (fs.existsSync(material.filePath)) {
      fs.unlinkSync(material.filePath);
    }

    await StudyMaterial.findByIdAndDelete(materialId);

    res.json({ message: 'Study material deleted successfully' });

  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
