import React, { createContext, useContext, useState, useEffect } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
const[postCreated,setPostCreated]=useState(false);
  const [posts, setPosts] = useState(() => {
    const storedPosts = localStorage.getItem('userPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  });


  const updatePosts = (newPost) => {
    setPosts([ newPost]);
    localStorage.setItem('userPosts', JSON.stringify([newPost]));
  };

  
  const setPostCreationStatus = (status) => {
    setPostCreated(status);
  };
  return (
    <PostContext.Provider value={{ posts, updatePosts, postCreated, setPostCreationStatus }}>
    {children}
  </PostContext.Provider>
  );
};

export const usePost = () => {
  return useContext(PostContext);
};
