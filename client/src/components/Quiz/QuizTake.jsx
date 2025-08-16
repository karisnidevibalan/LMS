// src/components/TakeQuiz.jsx
import { useState } from 'react';

// Props: quiz (with title, questions, each question: {question, options, correct index})
export default function TakeQuiz({ quiz, onComplete }) {
  // Track user's selected answers by question index
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(qIdx, optIdx) {
    if (submitted) return;
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  }

  function handleSubmit() {
    if (answers.some(a => a === null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    if (onComplete) onComplete(getScore(), answers);
  }

  function getScore() {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    return score;
  }

  function handleRetry() {
    setAnswers(Array(quiz.questions.length).fill(null));
    setSubmitted(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">{quiz.title || 'Quiz'}</h2>
      <ol>
        {quiz.questions.map((q, qIdx) => (
          <li key={qIdx} className="mb-8 border-b pb-6">
            <div className="font-semibold mb-3">
              {qIdx + 1}. {q.question}
            </div>
            <ul className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const checked = answers[qIdx] === optIdx;
                let optionStyle = "flex items-center space-x-3 px-3 py-2 rounded cursor-pointer border transition";
                if (submitted) {
                  if (q.correct === optIdx) {
                    optionStyle += " bg-green-100 border-green-400";
                  } else if (checked) {
                    optionStyle += " bg-red-100 border-red-400 text-red-700";
                  } else {
                    optionStyle += " border-gray-200";
                  }
                } else if (checked) {
                  optionStyle += " bg-blue-50 border-blue-400";
                } else {
                  optionStyle += " border-gray-200 hover:bg-blue-50";
                }
                return (
                  <li key={optIdx}>
                    <label className={optionStyle}>
                      <input
                        type="radio"
                        name={`q${qIdx}`}
                        value={optIdx}
                        checked={checked}
                        onChange={() => handleSelect(qIdx, optIdx)}
                        disabled={submitted}
                        className="form-radio accent-blue-500"
                      />
                      <span>{opt}</span>
                      {submitted && q.correct === optIdx && (
                        <span className="ml-1 text-green-700 font-medium">(Correct)</span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
            {submitted && answers[qIdx] !== q.correct && (
              <div className="text-sm text-red-500 mt-2">Your answer was incorrect.</div>
            )}
            {submitted && answers[qIdx] === q.correct && (
              <div className="text-sm text-green-600 mt-2">Correct!</div>
            )}
          </li>
        ))}
      </ol>
      {!submitted ? (
        <button
          className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700"
          onClick={handleSubmit}
        >Submit Quiz</button>
      ) : (
        <div className="mt-6">
          <div className="text-lg font-semibold text-center">
            Score: {getScore()} / {quiz.questions.length}
          </div>
          <button
            className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-blue-600 rounded"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
