const Lecture = require('../models/lecture');
const axios = require('axios'); // For translation API

// Get summarized explanation using GPT or a custom function
async function getExplanation(text, mode = 'standard') {
  if (mode === 'brief') {
    // Mock: Return simple summary (in real, call OpenAI or use an NLTK-based summarizer)
    return text.split('.').slice(0,2).join('.') + '.';
  }
  if (mode === 'detailed') {
    // Mock: Add more explanation (in real, call LLM or expand)
    return text + " For example, ...";
  }
  return text; // standard
}

// Translate text using e.g. Google Translate
async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  // Use Google Translate API for real use; here’s a mockup:
  // let res = await axios.post('https://translation.googleapis.com/language/translate/v2', { q: text, target: targetLang, key: process.env.GOOGLE_API_KEY });
  // return res.data.data.translations[0].translatedText;
  return `[${targetLang}] ${text}`;
}

exports.uploadLecture = async (req, res) => {
  const { title, description, content, visuals } = req.body;
  const teacher = req.user.id;
  const lecture = await Lecture.create({ title, description, content, teacher, visuals });
  res.status(201).json(lecture);
};

exports.fetchLecture = async (req, res) => {
  const { mode = 'standard', lang = 'en' } = req.query;
  const lecture = await Lecture.findById(req.params.id).populate('teacher', 'name');
  if (!lecture) return res.status(404).send('Lecture not found');
  let explanation = await getExplanation(lecture.content, mode);
  let translated = await translateText(explanation, lang);
  res.json({ ...lecture._doc, content: translated });
};
