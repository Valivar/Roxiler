
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ value = 0, onChange, readonly = false, size = 'md' }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (readonly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(0);
  };

  const handleClick = (index: number) => {
    if (readonly || !onChange) return;
    onChange(index);
  };

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const starSize = sizeMap[size];

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          className={cn(
            "star-rating-input",
            (hoverValue >= index || (!hoverValue && value >= index)) && "active",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        >
          <Star
            size={starSize}
            fill={(hoverValue >= index || (!hoverValue && value >= index)) ? "#f59e0b" : "none"}
            color={(hoverValue >= index || (!hoverValue && value >= index)) ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.5}
          />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
