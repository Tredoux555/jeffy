import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;
        
        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              isFilled || isHalfFilled 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-gray-200 text-gray-200"
            )}
          />
        );
      })}
    </div>
  );
}

