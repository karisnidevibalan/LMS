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
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-b from-[#fef9c3] via-[#fcd5ce] to-[#e0bbf9] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#2d2a4a] p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-200 mb-4">Rate This Course</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${rating >= star ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-400'}`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts about the course..."
            className="w-full px-4 py-2 rounded border dark:bg-[#3e3a60] dark:border-gray-600"
            rows="3"
          />

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl w-full"
          >
            Submit Review
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 text-[#4b006e] dark:text-white">Other Reviews</h3>
          {reviews.map((r, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-600 py-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{r.user}</strong> — {r.rating}⭐
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RateCourse;
