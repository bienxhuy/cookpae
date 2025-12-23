// components/NotificationCard.tsx
import React from 'react';

interface NotificationCardProps {
  username: string;
  action: string;
  recipeTitle: string;
  timeAgo: string;
  avatarUrl?: string; 
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  username,
  action,
  recipeTitle,
  timeAgo,
  avatarUrl,
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-800 p-5 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-gray-300"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 shrink-0 flex items-center justify-center text-white font-bold text-lg">
            {username[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium leading-snug">
            <span className="font-bold">{username}</span>{' '}
            <span className="font-normal">{action}:</span>{' '}
            <span className="font-semibold text-gray-800">{recipeTitle}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;