// server/utils/keywordExtractor.js
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Simple keyword extraction using frequency analysis
const extractKeywordsFromText = (text, maxKeywords = 20) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Clean and normalize text
  const cleanText = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'around', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'what',
    'which', 'who', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'can', 'just', 'now', 'also',
    'here', 'there', 'then', 'if', 'because', 'as', 'until', 'while', 'although'
  ]);

  // Split into words and count frequency
  const words = cleanText.split(/\s+/);
  const wordFreq = {};

  words.forEach(word => {
    // Only consider words with 3+ characters that aren't stop words
    if (word.length >= 3 && !stopWords.has(word) && !/^\d+$/.test(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  // Sort by frequency and get top keywords
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return sortedWords;
};

// Extract text from PDF files
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Extract text from Word documents
const extractTextFromWord = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    throw new Error('Failed to extract text from Word document');
  }
};

// Extract text from plain text files
const extractTextFromTxt = async (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading text file:', error);
    throw new Error('Failed to read text file');
  }
};

// Main function to extract keywords from uploaded file
const extractKeywordsFromFile = async (filePath, fileName, maxKeywords = 15) => {
  try {
    const ext = path.extname(fileName).toLowerCase();
    let text = '';

    switch (ext) {
      case '.pdf':
        text = await extractTextFromPDF(filePath);
        break;
      case '.doc':
      case '.docx':
        text = await extractTextFromWord(filePath);
        break;
      case '.txt':
      case '.md':
        text = await extractTextFromTxt(filePath);
        break;
      default:
        // For other file types, return empty array
        return [];
    }

    // Extract keywords from the text
    const keywords = extractKeywordsFromText(text, maxKeywords);
    
    console.log(`Extracted ${keywords.length} keywords from ${fileName}`);
    return keywords;

  } catch (error) {
    console.error('Error extracting keywords from file:', error);
    // Return empty array instead of throwing to not break upload
    return [];
  }
};

// Enhanced keyword extraction with subject-specific terms
const enhanceKeywords = (keywords, fileName, courseTitle = '') => {
  const enhanced = [...keywords];
  
  // Add subject-specific context based on filename and course
  const fileKeywords = extractKeywordsFromText(fileName.replace(/[_-]/g, ' '), 5);
  const courseKeywords = extractKeywordsFromText(courseTitle, 5);
  
  // Merge and deduplicate
  const allKeywords = [...new Set([...enhanced, ...fileKeywords, ...courseKeywords])];
  
  return allKeywords.slice(0, 20); // Limit to 20 keywords
};

module.exports = {
  extractKeywordsFromFile,
  extractKeywordsFromText,
  enhanceKeywords
};
