import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import {notifySuccess,notifyError,notifyWarning} from "./Notify"
function CreatePost() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const { updatePosts, postCreated, setPostCreationStatus } = usePost();

  const handleCreatePost = async () => {
    const token = user.token;
    const isUserPremium = user.isPremium;

    const newPostData = {
      title,
      content,
      isPremium: isUserPremium ? isPremium : false,
    };

    try {
      const response = await fetch('/apiposts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(newPostData),
      });

      if (response.ok) {
        setPostCreationStatus(true);
        setTitle('');
        setContent('');
        setIsPremium(false);
        notifySuccess("Post Created")
      } else {
        console.error('Failed to create a new post');
        notifyError('Failed to create a new post')
      }
    } catch (error) {
      console.error('API request failed:', error);
      notifyError(error)
    }
  };

  return (
    <div className="p-4  rounded-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {user.isPremium ? (
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={() => setIsPremium(!isPremium)}
            className="mr-2"
          />
          Premium
        </label>
      ) : (
        <div>
          <p>You are not a premium user. You can only create free posts.</p>
        </div>
      )}
      <button
        onClick={handleCreatePost}
        className="bg-blue-500 hover-bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        disabled={!user?.isPremium && isPremium} 
      >
        Create Post
      </button>
      {postCreated && (
        <p className="mt-2 text-green-600">Post created successfully!</p>
      )}
    </div>
  );
}

export default CreatePost;
