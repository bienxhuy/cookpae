import React from 'react';
import { Heart } from 'lucide-react';

interface FoodCard1Props {
  title: string;
  author: string;
  likes: number;
  imageUrl?: string;
}

const FoodCard1: React.FC<FoodCard1Props> = ({ title, author, likes, imageUrl }) => {
  return (
    <div className="w-auto rounded-2xl border-2 border-gray-800 bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"  
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">by {author}</span>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span className="text-gray-900">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard1;