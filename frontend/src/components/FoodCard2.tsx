import React from 'react';
import { Heart } from 'lucide-react';

interface FoodCard2Props {
  title: string;
  author: string;
  likes: number;
  description?: string;
  imageUrl?: string;
}

const FoodCard2: React.FC<FoodCard2Props> = ({ title, author, likes, description, imageUrl }) => {
  return (
    <div className="w-auto h-auto rounded-2xl border-2 border-gray-800 bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex gap-4 p-3">
        {imageUrl && (
          <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">by {author}</span>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span className="text-gray-900">{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard2;