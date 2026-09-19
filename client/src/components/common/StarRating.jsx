import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onChange, readonly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hover || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
              transition-transform duration-200 focus:outline-none
            `}
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            aria-label={`Rate ${star} stars out of 5`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                isFilled 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'fill-transparent text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
