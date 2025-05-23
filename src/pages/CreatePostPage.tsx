import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import { useAuth } from '../context/AuthContext'

interface PostInput {
  title: string
  content: string
  avatar_url:string|null
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("posts-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};


export const CreatePostPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {user}=useAuth();
  const {mutate}=useMutation({mutationFn:(data:{post:PostInput,imageFile:File})=>{
    return createPost(data.post,data.imageFile);
  }})

  const handleSubmit= (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select an image file')
      return
    }
    mutate({post:{title, content,avatar_url:
      user?.user_metadata.avatar_url||null
}, imageFile: selectedFile!})
   
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
  }}

  return (
   <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
  <div>
    <label htmlFor="title" className="block mb-2 font-medium">
      Post Title
    </label>
    <input
      type="text"
      id="title"
      required
      onChange={e => setTitle(e.target.value)}
      className="w-full border border-white/10 bg-transparent p-2 rounded"
    />
  </div>

  <div>
    <label htmlFor="content" className="block mb-2 font-medium">
      Post Content
    </label>
    <textarea
      id="content"
      required
      onChange={e => setContent(e.target.value)}
      className="w-full border border-white/10 bg-transparent p-2 rounded"
      rows={5}
    />
  </div>

  <div>
    <label htmlFor="image" className="block mb-2 font-medium">
      Upload Image
    </label>
    <input
      type="file"
      id="image"
      required
      accept="image/*"
      onChange={handleFileChange}
      className="w-full text-gray-200"
    />
  </div>

  <button
    type="submit"
    className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-600"
  >
    Create Post
  </button>
</form>

  )
}
