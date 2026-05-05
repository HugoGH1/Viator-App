import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showValue = true,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const isFull = index < fullStars;
          const isHalf = index === fullStars && hasHalfStar;

          return (
            <Star
              key={index}
              className={cn(
                sizeMap[size],
                isFull || isHalf
                  ? "fill-action-green text-action-green"
                  : "fill-transparent text-light-beige/50"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-very-light-beige font-semibold">{rating}</span>
      )}
    </div>
  );
}
