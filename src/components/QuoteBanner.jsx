import React, { useEffect, useState } from 'react';

const quotes = [
  "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "An investment in knowledge pays the best interest.",
  "Education is not preparation for life; education is life itself.",
  "The more that you read, the more things you will know. The more that you learn, the more places you’ll go.",
  "Learning never exhausts the mind, it only ignites it.",
  "The expert in anything was once a beginner.",
  "Don’t let what you cannot do interfere with what you can do."
];

const QuoteBanner = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-white text-indigo-700 font-medium py-2 px-4 text-center animate-fade rounded shadow-md mx-4 mt-2 relative">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 text-indigo-400 hover:text-indigo-700"
        title="Dismiss"
      >
        ✖️
      </button>
      “{quotes[quoteIndex]}”
    </div>
  );
};

export default QuoteBanner;