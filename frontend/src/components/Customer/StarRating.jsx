// StarRating.jsx
import React from "react";

// Star rating display component
export const StarRatingDisplay = ({ rating }) => {
  const safeRating = Number(rating);
  const ratingValue = Number.isFinite(safeRating) ? safeRating : 0;
  const full = Math.floor(ratingValue);
  const hasHalf = ratingValue - full >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <span key={index} className="text-lg">
          {index < full ? (
            <span className="text-gray-800">★</span>
          ) : index === full && hasHalf ? (
            <span className="text-gray-800">★</span>
          ) : (
            <span className="text-gray-300">★</span>
          )}
        </span>
      ))}
      <span className="ml-2 text-gray-600 text-sm">({ratingValue.toFixed(1)})</span>
    </div>
  );
};

// Star rating input component
export const StarRatingInput = ({ rating, setRating, hoverRating, setHoverRating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          className="text-2xl focus:outline-none"
          onClick={() => setRating(index + 1)}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {index < (hoverRating || rating) ? (
            <span className="text-gray-900">★</span>
          ) : (
            <span className="text-gray-300">★</span>
          )}
        </button>
      ))}
      <span className="ml-2 text-gray-600 text-sm">
        {hoverRating || rating || 0}/5
      </span>
    </div>
  );
};