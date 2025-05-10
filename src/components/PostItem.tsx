import React from 'react'
import type { Post } from './PostList'
import { Link } from 'react-router'

interface Props {
  post: Post
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg">
      <Link to={`/posts/${post.id}`} className="block">
        {/* Image */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            {post.avatar_url && (
              <img
                src={post.avatar_url}
                alt="Author avatar"
                className="w-10 h-10 rounded-full border"
              />
            )}
            <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.content}</p>
          <p className="mt-2 text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </Link>
    </div>
  )
}
