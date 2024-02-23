import React, { createContext, useContext, useState, useEffect } from 'react';

const FeedPostContext = createContext();

export const FeedPostProvider = ({ children }) => {
  const [feedPosts, setFeedPosts] = useState(() => {
    const storedFeedPosts = localStorage.getItem('feedPosts');
    return storedFeedPosts ? JSON.parse(storedFeedPosts) : [];
  });

  const updateFeedPosts = (newFeedPost) => {
    setFeedPosts(newFeedPost);
    localStorage.setItem('feedPosts', JSON.stringify(newFeedPost));
  };

  return (
    <FeedPostContext.Provider value={{ feedPosts, updateFeedPosts }}>
      {children}
    </FeedPostContext.Provider>
  );
};

export const useFeedPost = () => {
  return useContext(FeedPostContext);
};
