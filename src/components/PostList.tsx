import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import { PostItem } from './PostItem'

export interface Post {
  id: number
  title: string
  content: string
  created_at: string
  image_url: string
  avatar_url: string | null
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    throw new Error(error.message)
  }
  return data as Post[]
}

export const PostList = () => {
  const {
    data,
    isLoading,
    error
  } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts
  })

  if (isLoading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-red-500 text-center py-10">Error: {error.message}</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {data?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  )
}
