import { useQuery } from '@tanstack/react-query';
import React from 'react'
import type { Post } from '../components/PostList';
import { supabase } from '../supabase-client';


interface Props{
  postId: number;
}
const fetchPostbyId = async (postId: number): Promise<Post> => {
  const {data,error}=await supabase.from('posts').select('*').eq('id', postId).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export const PostDetail = ({postId}:Props) => {
  const {data, isLoading, error} = useQuery<Post,Error>({
    queryKey:['post', postId],
    queryFn:  () => fetchPostbyId(postId),
    
  });
if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  return (
    console.log(data),
    <div>
      <h2>
        {data?.title}
        </h2>
        <img src={data?.image_url} alt={data?.title} className="w-full h-auto" />
        <div className="text-gray-300"> 
          {data?.content}
          </div>
        </div>


  )
}
