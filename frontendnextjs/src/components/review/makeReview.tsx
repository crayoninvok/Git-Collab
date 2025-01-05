// src/components/ReviewForm.tsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReviewFormProps {
  eventId: number;
  userId: string;
  isEventFinished: boolean;
  onSuccess?: () => void;
}

const ReviewForm = ({ eventId, userId, isEventFinished, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEventFinished) {
      setError('Cannot review an event that has not finished yet.');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/reviews/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          eventId,
          userId,
          rating,
          comment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setSuccess('Review submitted successfully!');
      setComment('');
      setRating(0);
      onSuccess?.();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  className="hidden"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className="w-8 h-8 transition-colors"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
            placeholder="Write your review here..."
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;