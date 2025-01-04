'use client'

import { useEffect, useState } from 'react';
import { useSession } from '@/context/useSessionHook';
import { formatDate } from '@/helpers/formatDate';
import { FaStar } from 'react-icons/fa';
import AdminSidebar from '@/components/AdminSidebar';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    username: string;
    avatar: string;
  };
}

export default function EventReviewsPage({ params }: { params: { id: string } }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState('');
  const { isAuth, type } = useSession();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const eventResponse = await fetch(`${base_url}/events/${params.id}`);
        const eventData = await eventResponse.json();
        setEventTitle(eventData.title);

        const reviewsResponse = await fetch(`${base_url}/reviews/event/${params.id}`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuth && type === 'promotor') {
      fetchReviews();
    }
  }, [isAuth, type, params.id, base_url]);

  if (!isAuth || type !== 'promotor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-xl text-white">Please log in as a promotor to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-xl text-white">Loading reviews...</div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black pt-20 px-4">
          <AdminSidebar/>
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-800/50 rounded-xl p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{eventTitle}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="text-white text-lg font-semibold">{averageRating}</span>
            </div>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-zinc-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.user.avatar || '/default-avatar.png'}
                    alt={review.user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{review.user.username}</h3>
                    <p className="text-gray-400 text-sm">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < review.rating ? 'text-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}