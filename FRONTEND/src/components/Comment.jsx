import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { Link } from 'react-router-dom';

const Comment = ({ comment }) => {
  return (
    <div className="max-h-140 overflow-y-auto px-2 space-y-4">
      <div className="flex-shrink-0">
        <Link
          to={`/profile/${comment.author._id}`}
          className="flex items-center gap-3 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
        >
          <Avatar className="w-10 h-10 rounded-full border border-gray-300 shadow-sm overflow-hidden">
            <AvatarImage
              src={comment.author.profilePicture}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="flex items-center justify-center w-full h-full bg-pink-500 text-white font-bold text-sm">
              {comment.author.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="font-semibold text-sm text-gray-800">
            {comment.author.username}
          </span>
        </Link>

      </div>
      <div className="bg-gray-100 rounded-xl px-4 py-2 w-full">
        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
      </div>
    </div>
  );
};

export default Comment;
