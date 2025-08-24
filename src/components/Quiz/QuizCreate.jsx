// src/components/QuizCreator.jsx
import { useState } from 'react';

function Modal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-black rounded shadow-lg p-8 w-80">
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 border rounded text-gray-500 hover:bg-gray-100" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function QuizCreator() {
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correct: 0 }
  ]);
  const [quizTitle, setQuizTitle] = useState('');
  const [validation, setValidation] = useState('');
  const [showModal, setShowModal] = useState(false);

  function handleQuestionChange(index, value) {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  }

  function handleOptionChange(qIdx, oIdx, value) {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  }

  function handleAddQuestion() {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: 0 }]);
  }

  function handleRemoveQuestion(qIdx) {
    setQuestions(questions.filter((_, idx) => idx !== qIdx));
  }

  function handleMarkCorrect(qIdx, oIdx) {
    const updated = [...questions];
    updated[qIdx].correct = oIdx;
    setQuestions(updated);
  }

  function handleAddOption(qIdx) {
    const updated = [...questions];
    updated[qIdx].options.push('');
    setQuestions(updated);
  }

  function handleRemoveOption(qIdx, oIdx) {
    if (questions[qIdx].options.length <= 2) return; // minimum 2 options
    const updated = [...questions];
    updated[qIdx].options.splice(oIdx, 1);
    if (updated[qIdx].correct >= updated[qIdx].options.length) {
      updated[qIdx].correct = 0;
    }
    setQuestions(updated);
  }

  function validate() {
    if (!quizTitle.trim()) return "Quiz title cannot be empty.";
    for (let i = 0; i < questions.length; ++i) {
      const q = questions[i];
      if (!q.question.trim()) return `Question ${i + 1} cannot be empty.`;
      if (q.options.some(opt => !opt.trim())) return `Fill all options for question ${i + 1}.`;
    }
    return '';
  }

  function handleSaveQuiz() {
    const error = validate();
    if (error) {
      setValidation(error);
      return;
    }
    setValidation('');
    setShowModal(true); // open the confirmation modal
  }

  function confirmSave() {
    setShowModal(false);
    // Replace with actual saving logic (API call, state update, etc).
    alert('Quiz saved! (Implement further logic as needed)');
  }

  // UI rendering
  return (
    <div className="max-w-4xl mx-auto mt-10 flex flex-col md:flex-row gap-8">
      <div className="flex-1 p-6 blue shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create a New Quiz</h2>
        <input
          aria-label="Quiz title"
          className="block mb-2 font-semibold text-black px-4 py-2 border border-black-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={e => setQuizTitle(e.target.value)}
        />
        {questions.map((q, qIdx) => (
          <section key={qIdx} className="mb-10 border-t pt-4" aria-labelledby={`q-${qIdx}-label`}>
            <label id={`q-${qIdx}-label`} className="block mb-2 font-semibold text-blue-50">Question {qIdx + 1}</label>
            <input
              className="block mb-2 font-semibold text-black px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder={`Enter Question ${qIdx + 1}`}
              value={q.question}
              onChange={e => handleQuestionChange(qIdx, e.target.value)}
              aria-required="true"
            />
            <div className="mb-3 font-light text-sm">Options<span className="text-blue-500 ml-2">(click “Correct” to select answer)</span></div>
            {q.options.map((option, oIdx) => (
              <div key={oIdx} className="flex items-center mb-2 gap-2">
                <input
                  className="flex-1 px-3 py-2 block mb-2 font-semibold text-black"
                  placeholder={`Option ${oIdx + 1}`}
                  value={option}
                  onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                  aria-required="true"
                />
                <button
                  type="button"
                  className={`px-2 py-1 text-xs rounded transition 
                    ${q.correct === oIdx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'}`}
                  onClick={() => handleMarkCorrect(qIdx, oIdx)}
                  aria-label={`Mark as correct answer for question ${qIdx + 1}`}
                >Correct</button>
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 px-2"
                  onClick={() => handleRemoveOption(qIdx, oIdx)}
                  disabled={q.options.length <= 2}
                  title="Remove this option"
                >🗑️</button>
              </div>
            ))}
            <button
              type="button"
              className="mt-1 mb-2 px-3 py-1 text-green-600 border border-green-300 rounded hover:bg-green-50"
              onClick={() => handleAddOption(qIdx)}
            >+ Add Option</button>
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                className="text-red-500 hover:underline"
                onClick={() => handleRemoveQuestion(qIdx)}
                disabled={questions.length === 1}
                aria-label={`Remove question ${qIdx + 1}`}
              >Remove Question</button>
              {qIdx === questions.length - 1 && (
                <button
                  type="button"
                  className="text-green-600 hover:underline"
                  onClick={handleAddQuestion}
                >+ Add Question</button>
              )}
              {/* For reorderable questions, insert drag icon here and implement drag-and-drop with a library */}
            </div>
          </section>
        ))}
        <button
          className="w-full py-3 mt-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded shadow"
          onClick={handleSaveQuiz}
        >Save Quiz</button>
        {validation && <p className="mt-4 text-red-500">{validation}</p>}

        <Modal
          open={showModal}
          message="Are you sure you want to save this quiz?"
          
          onConfirm={confirmSave}
          onCancel={() => setShowModal(false)}
        />
      </div>

      {/* Live Preview Panel */}
      <aside className="flex-1 p-6 bg-gray-50 rounded-lg border hidden md:block md:sticky top-8 h-fit">
        <h3 className="text-xl font-semibold mb-3 pb-2 border-b">Live Preview</h3>
        <h4 className="text-lg font-bold mb-2">{quizTitle || 'Quiz Title'}</h4>
        <ol>
          {questions.map((q, idx) => (
            <li key={idx} className="mb-4">
              <span className="font-medium">{idx + 1}. {q.question || <span className="italic text-gray-400">[No question]</span>}</span>
              <ul className="pl-6 mt-2">
                {q.options.map((opt, oIdx) => (
                  <li key={oIdx} className={`mb-1 
                    ${q.correct === oIdx ? 'text-green-700 font-semibold' : ''}`}>
                    {opt || <span className="italic text-gray-400">[No option]</span>}
                    {q.correct === oIdx && <span className="ml-2 text-green-600 text-xs">(Correct)</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
