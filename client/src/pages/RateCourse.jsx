// src/components/pages/RateCourse.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Star } from 'lucide-react';

const RateCourse = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([
    {
      user: 'John Doe',
      rating: 4,
      comment: 'Really good and easy to understand!'
    },
    {
      user: 'Anita Sharma',
      rating: 5,
      comment: 'Amazing course — loved the examples.'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      toast.error('Please provide a rating and comment.');
      return;
    }
    setReviews([...reviews, { user: 'You', rating, comment }]);
    toast.success('Thank you for your feedback!');
    setRating(0);
    setComment('');
  };

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-b from-yellow-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-yellow-700 dark:text-yellow-400 mb-6 sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">Rate This Course</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={36}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${rating >= star ? 'fill-yellow-500 stroke-yellow-500' : 'stroke-gray-400'} hover:scale-110`}
                style={{filter: rating >= star ? 'drop-shadow(0 0 4px #fbbf24)' : 'none'}}
                aria-label={`Rate ${star} star`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts about the course..."
            className="w-full px-4 py-3 rounded border border-yellow-400 dark:bg-gray-800 dark:border-yellow-600 text-lg text-gray-900 dark:text-yellow-100 focus:ring-2 focus:ring-yellow-500"
            rows="3"
          />

          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-xl w-full font-bold text-lg shadow"
          >
            Submit Review
          </button>
        </form>

        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">Other Reviews</h3>
          {reviews.map((r, index) => (
            <div key={index} className="border-b border-yellow-200 dark:border-yellow-700 py-3">
              <p className="text-lg text-gray-900 dark:text-yellow-100">
                <strong>{r.user}</strong> — <span className="text-yellow-500">{r.rating}&#9733;</span>
              </p>
              <p className="text-base text-gray-700 dark:text-yellow-200">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RateCourse;
