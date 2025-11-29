const multer = require('multer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Export the upload middleware
exports.upload = upload.single('idProof');


// ✅ Register Controller
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      instituteName,
      educationLevel,
      careerDetails,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const idProofUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      instituteName,
      educationLevel,
      careerDetails,
      idProofUrl,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


// ✅ Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        instituteName: user.instituteName,
        educationLevel: user.educationLevel,
        careerDetails: user.careerDetails,
        idProofUrl: user.idProofUrl,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// ✅ Get User Profile Controller
exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    
    res.json({
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        instituteName: user.instituteName,
        educationLevel: user.educationLevel,
        careerDetails: user.careerDetails,
        idProofUrl: user.idProofUrl,
        favoriteCharacter: user.favoriteCharacter,
        studyPreferences: user.studyPreferences,
        totalStudyTime: user.totalStudyTime,
      }
    });
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ error: 'Failed to get profile', details: err.message });
  }
};

// ✅ Update User Preferences (Character & Study Settings)
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { favoriteCharacter, studyPreferences } = req.body;

    // Validate character name if provided
    const validCharacters = ['Professor Alex', 'Friendly Charlie', 'Wise Sage', 'Energy Eva', 'Calm Jordan'];
    if (favoriteCharacter && !validCharacters.includes(favoriteCharacter)) {
      return res.status(400).json({ error: 'Invalid character selection' });
    }

    // Build update object
    const updateData = {};
    if (favoriteCharacter) updateData.favoriteCharacter = favoriteCharacter;
    if (studyPreferences) {
      // Validate study preferences if provided
      updateData.studyPreferences = {
        voiceEnabled: studyPreferences.voiceEnabled !== undefined ? studyPreferences.voiceEnabled : true,
        playbackSpeed: studyPreferences.playbackSpeed || 1,
        preferredLanguage: studyPreferences.preferredLanguage || 'en-US',
        darkMode: studyPreferences.darkMode !== undefined ? studyPreferences.darkMode : true,
      };
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      user: {
        _id: user._id,
        favoriteCharacter: user.favoriteCharacter,
        studyPreferences: user.studyPreferences,
      }
    });
  } catch (err) {
    console.error('Update Preferences Error:', err);
    res.status(500).json({ error: 'Failed to update preferences', details: err.message });
  }
};
