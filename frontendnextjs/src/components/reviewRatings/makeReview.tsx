import React, { useState } from 'react';

const ReviewRating = () => {
  const [rating, setRating] = useState<number>(0); // Menyimpan rating
  const [review, setReview] = useState<string>(''); // Menyimpan review

  // Fungsi untuk menangani perubahan rating
  const handleRatingChange = (value: number): void => {
    setRating(value);
  };

  // Fungsi untuk menangani perubahan review
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setReview(e.target.value);
  };

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();
    // Logika untuk mengirim review dan rating ke server atau penyimpanan lainnya
    alert(`Rating: ${rating}, Review: ${review}`);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold">Beri Rating & Review</h2>

      {/* Rating dengan Daisy UI - bintang */}
      <div className="rating">
        {[...Array(5)].map((_, index) => (
          <input
            key={index}
            type="radio"
            name="rating-1"
            className="mask mask-star-2 bg-yellow-400"
            checked={rating === index + 1}
            onChange={() => handleRatingChange(index + 1)}
          />
        ))}
      </div>

      {/* Input Review menggunakan Daisy UI */}
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Tulis review kamu..."
        value={review}
        onChange={handleReviewChange}
      ></textarea>

      {/* Tombol Kirim menggunakan Daisy UI */}
      <button
        onClick={handleSubmit}
        className="btn btn-primary w-full"
      >
        Kirim Review
      </button>
    </div>
  );
};

export default ReviewRating;
