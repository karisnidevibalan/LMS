const OpenAI = require("openai");
const path = require("path");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set!
});

// Character voices mapping with OpenAI TTS voice IDs
const CHARACTER_VOICES = {
  "Professor Alex": {
    voice: "onyx",
    description: "Professional educator with clear articulation",
    tone: "formal",
  },
  "Friendly Charlie": {
    voice: "alloy",
    description: "Enthusiastic and encouraging learning guide",
    tone: "casual",
  },
  "Wise Sage": {
    voice: "echo",
    description: "Thoughtful mentor with calming presence",
    tone: "meditative",
  },
  "Energy Eva": {
    voice: "fable",
    description: "Dynamic instructor with upbeat energy",
    tone: "energetic",
  },
  "Calm Jordan": {
    voice: "shimmer",
    description: "Patient tutor with gentle guidance",
    tone: "soothing",
  },
};

exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "gpt-3.5-turbo",
    });

    res.json({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to get a response from OpenAI" });
  }
};

/**
 * Generate character narration for study material
 * POST /api/openai/character-narration
 * Body: { text, character, language }
 * Returns: { audioUrl, character, duration, generatedAt }
 */
exports.generateCharacterNarration = async (req, res) => {
  try {
    const { text, character = "Professor Alex", language = "en-US" } = req.body;

    console.log('📢 Narration request received:', {
      textLength: text?.length || 0,
      character,
      language,
      hasText: !!text
    });

    // Validate inputs
    if (!text || text.trim().length === 0) {
      console.log('❌ Validation failed: Empty text');
      return res.status(400).json({ error: "Text content is required" });
    }

    if (!CHARACTER_VOICES[character]) {
      console.log('❌ Validation failed: Invalid character', character);
      return res.status(400).json({
        error: `Invalid character. Available characters: ${Object.keys(CHARACTER_VOICES).join(", ")}`,
      });
    }

    // Limit text length for API (OpenAI TTS has limits)
    const MAX_TEXT_LENGTH = 4096;
    if (text.length > MAX_TEXT_LENGTH) {
      console.log('❌ Validation failed: Text too long', text.length);
      return res.status(400).json({
        error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`,
      });
    }

    const selectedVoice = CHARACTER_VOICES[character];
    console.log('✅ Validation passed, generating speech with voice:', selectedVoice.voice);

    // Generate speech using OpenAI TTS
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: selectedVoice.voice,
      input: text,
      speed: 1.0,
    });

    // Create directory for audio files if it doesn't exist
    const audioDir = path.join(__dirname, "../uploads/audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Save audio file with unique name
    const timestamp = Date.now();
    const audioFileName = `narration_${timestamp}_${character.replace(/\s+/g, "_")}.mp3`;
    const audioFilePath = path.join(audioDir, audioFileName);

    // Convert response to buffer and save
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    fs.writeFileSync(audioFilePath, buffer);

    // Create a URL-friendly path (relative to server)
    const audioUrl = `/uploads/audio/${audioFileName}`;

    // Estimate duration (approximate: 140 words per minute)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = Math.ceil((wordCount / 140) * 60); // in seconds

    res.json({
      success: true,
      audioUrl,
      character,
      voice: selectedVoice.voice,
      duration: estimatedDuration,
      generatedAt: new Date(),
      language,
    });
  } catch (error) {
    console.error("Character Narration Error:", error);
    res.status(500).json({
      error: "Failed to generate character narration",
      details: error.message,
    });
  }
};

/**
 * Get all available characters
 * GET /api/openai/characters
 * Returns: Array of available characters with descriptions
 */
exports.getAvailableCharacters = async (req, res) => {
  try {
    const characters = Object.entries(CHARACTER_VOICES).map(([name, details]) => ({
      name,
      voice: details.voice,
      description: details.description,
      tone: details.tone,
    }));

    res.json({ success: true, characters, count: characters.length });
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ error: "Failed to fetch available characters" });
  }
};
