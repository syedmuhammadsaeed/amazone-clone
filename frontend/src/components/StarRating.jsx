import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, reviews }) => {
  return (
    <div className="rating" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={rating >= star - 0.5 ? '#f5a623' : 'none'}
          color={rating >= star - 0.5 ? '#f5a623' : '#c8ced8'}
        />
      ))}
      <span>{rating.toFixed(1)}</span>
      {typeof reviews === 'number' && <span className="muted">({reviews})</span>}
    </div>
  );
};

export default StarRating;
