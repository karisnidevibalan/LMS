// server.js - Backend Entry Point
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OpenAI = require("openai"); // ✅ updated import

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/elearning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// OpenAI Configuration ✅ updated initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const AITeacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  avatar: String,
  personality: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'AITeacher' },
  messages: [{
    sender: { type: String, enum: ['user', 'ai'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
const AITeacher = mongoose.model('AITeacher', AITeacherSchema);
const Chat = mongoose.model('Chat', ChatSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
    res.json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Course Routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/courses', authenticateToken, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AI Teacher Routes
app.post('/api/ai-teachers', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const { name, subject, personality } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    
    const aiTeacher = new AITeacher({
      name,
      subject,
      personality,
      avatar,
      createdBy: req.user.userId
    });
    
    await aiTeacher.save();
    res.json(aiTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/ai-teachers', async (req, res) => {
  try {
    const teachers = await AITeacher.find().populate('createdBy', 'name');
    res.json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Chat Routes
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, teacherId } = req.body;
    const userId = req.user.userId;
    
    // Find or create chat session
    let chat = await Chat.findOne({ userId, teacherId });
    if (!chat) {
      chat = new Chat({ userId, teacherId, messages: [] });
    }
    
    // Add user message
    chat.messages.push({ sender: 'user', content: message });
    
    // Get AI teacher info
    const teacher = await AITeacher.findById(teacherId);
    
    // Generate AI response using OpenAI ✅ updated call
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are ${teacher.name}, an AI teacher specializing in ${teacher.subject}. 
                     Your personality: ${teacher.personality}. 
                     Answer the student's question in a helpful, educational manner.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 500
      });
      
      const aiResponse = response.choices[0].message.content;
      chat.messages.push({ sender: 'ai', content: aiResponse });
      
      await chat.save();
      res.json({ response: aiResponse });
    } catch (openaiError) {
      // Fallback response if OpenAI fails
      const fallbackResponse = `Hello! I'm ${teacher.name}, your ${teacher.subject} teacher. I'd be happy to help you with your question about: "${message}". Please provide more specific details so I can assist you better.`;
      chat.messages.push({ sender: 'ai', content: fallbackResponse });
      await chat.save();
      res.json({ response: fallbackResponse });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/chat/:teacherId', authenticateToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const userId = req.user.userId;
    
    const chat = await Chat.findOne({ userId, teacherId });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// General AI Chatbot Route
app.post('/api/general-chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful educational assistant. Answer questions clearly and provide educational value."
          },
          { role: "user", content: message }
        ],
        max_tokens: 500
      });
      
      const aiResponse = response.choices[0].message.content;
      res.json({ response: aiResponse });
    } catch (openaiError) {
      const fallbackResponse = `I understand you're asking about: "${message}". As an educational assistant, I'd recommend breaking this topic down into smaller parts. Could you provide more specific questions so I can help you better?`;
      res.json({ response: fallbackResponse });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
