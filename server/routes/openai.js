const express = require('express');
const router = express.Router();
const { askQuestion, generateCharacterNarration, getAvailableCharacters } = require('../controllers/openaiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/ask', askQuestion);

// Character narration endpoints
router.post('/character-narration', authMiddleware(['student', 'teacher']), generateCharacterNarration);
router.get('/characters', getAvailableCharacters);

module.exports = router;
