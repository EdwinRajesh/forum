import React from 'react'
import { useParams } from 'react-router';
import { PostDetail } from '../components/PostDetail';

export const PostPage = () => {
  const {id} = useParams<{ id: string }>();
  return (
    <>
    <PostDetail postId={Number(id)} /></>
  )
}
