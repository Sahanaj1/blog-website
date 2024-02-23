import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFeedPost } from '../context/FeedPostContext';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai"
import { AiTwotoneLike } from "react-icons/ai"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
import { BiCommentDetail } from "react-icons/bi"
import ModalView from './Modal';
import { BsStars } from 'react-icons/bs';

function Feed() {
  const { user } = useAuth();
  const { feedPosts, updateFeedPosts } = useFeedPost();
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [comments, setComments] = useState({});
  const [likeIcon, setLikeIcon] = useState(false);
  const [newComment, setNewComment] = useState(''); 
  const [postIdForComment, setPostIdForComment] = useState(null); 
  const [addNewComment, setAddNewComment] = useState(false);
  const [filter, setFilter] = useState('all');
  const handleLike = (postId) => {
    const token = user.token;

    fetch(`/apiposts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Post liked successfully.');
          setInitialFetchDone(false);
          fetchPosts();
          setLikeIcon(true);
        } else {
          console.error('Failed to like the post');
          throw new Error('Failed to like the post');
        }
      })
      .catch((error) => console.error('API request failed:', error));
  };

  const handleComment = (postId, commentText) => {
    const token = user.token;

    const commentData = { text: commentText };

    fetch(`/apiposts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(commentData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Comment added successfully.');
          setInitialFetchDone(false);
          fetchPosts();
          setComments({});
          setAddNewComment(false);
        } else {
          console.error('Failed to add a comment');
          throw new Error('Failed to add a comment');
        }
      })
      .catch((error) => console.error('API request failed:', error));
  };

  const fetchPosts = () => {
    if (!initialFetchDone) {
      const token = user.token;

      fetch(`/apiposts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch posts');
          }
        })
        .then((data) => {
          updateFeedPosts(data);
          setInitialFetchDone(true);
        })
        .catch((error) => console.error('API request failed:', error));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user.token, updateFeedPosts, initialFetchDone]);

  const filteredPosts = filter === 'premium'
    ? feedPosts.filter((post) => post.isPremium)
    : filter === 'nonPremium'
      ? feedPosts.filter((post) => !post.isPremium)
      : feedPosts;
  return (
    <div className="my-4 p-4 rounded-lg flex flex-col items-start w-full">
      <div className='flex justify-start w-full pb-4'>
        <label className="text-gray-600">
          Filter by:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="ml-2 p-2 border rounded-lg text-gray-800 bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="all">All</option>
            <option value="premium">Premium</option>
            <option value="nonPremium">Non-Premium</option>
          </select>
        </label>

      </div>
      {filteredPosts && filteredPosts?.length > 0 ? (
        filteredPosts?.map((post) => (
          <div key={post._id} className="mb-4 p-4 border rounded-lg w-[70%]">

            <div className='flex justify-between'>
              <div className="flex items-center">
                <div className='border rounded-full p-1'>
                  <img
                    src={"https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} // Replace with the URL of the user's avatar
                    alt={`${user?.username}'s avatar`}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  />
                </div>
                <div className="text-black font-bold text-lg cursor-pointer ml-2">{post?.author?.username}</div>
              </div>
              <div className="text-gray-600">
                {post?.isPremium ?
                  <div className='h-8 rounded-l-lg cursor-pointer px-2 bg-white flex justify-evenly items-center border border-yellow-500 '>
                    <div className='text-yellow-500 font-semibold'>Premium</div>
                    <div>
                      <BsStars style={{ color: "rgb(234 179 8)" }} />
                    </div>
                  </div>

                  : <div className='h-8 cursor-pointer bg-white flex px-2 justify-evenly items-center border border-gray-300 rounded-l-lg'>
                    <div className='text-gray-300 text-sm'>Non Premium</div>
                  </div>}
              </div>
            </div>
            <div className='py-3'>
              <div className="text-lg font-semibold cursor-pointer">{post?.title}</div>
              <div className="text-gray-600 cursor-pointer">{post?.content}</div>
            </div>

            {/* {post.likes.some((like) => like.userId === user.userId) && (
              <div className="text-green-600">You've liked this post</div>
            )}
            {post.comments.some((comment) => comment.author === user.userId) && (
              <div className="text-blue-600">You've commented on this post</div>
            )}
             */}

            <div className='flex border-t justify-between py-2'>
              {/* <div className="text-gray-600">Likes: {post.likes.length}</div> */}
              <div className='flex items-center'>
                <div className="flex items-center cursor-pointer" title='Comments'>
                  <div style={{ fontSize: '20px' }}>
                    <BiCommentDetail />
                  </div>
                  <div className='ml-2'>
                    {post?.comments?.length}</div></div>
                <div onClick={() => handleLike(post?._id)} className='flex cursor-pointer items-center ml-4' title='Likes'>
                  <div style={{ fontSize: '20px' }}>
                    {post?.likes?.some((like) => like?.userId === user?.userId) ? (
                      <AiTwotoneLike style={{ transform: 'scaleX(-1)', fill: 'blue' }} />
                    ) : (
                      <AiOutlineLike style={{ transform: 'scaleX(-1)' }} />
                    )}
                  </div>
                  <div className='ml-2'>
                    {post?.likes?.length}
                  </div>
                </div>
              </div>

              <button onClick={() => setAddNewComment(!addNewComment)}>Add a comment</button>
              <div className='flex items-center'>
                <Link to={`/post/${post._id}`}>
                  Details
                </Link>
                <div style={{ fontSize: "20px" }}>
                  <AiOutlineRight />
                </div>
              </div>

            </div>
            {
              addNewComment &&
              <div className='w-full flex justify-between items-center mt-4'>
                <div className='w-[90%]'>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    className='p-2 border rounded-3xl w-full'
                    value={comments[post._id] || ''} 
                    onChange={(e) => setComments({ ...comments, [post._id]: e.target.value })}
                  />
                </div>
                <div className='w-[5%]'>
                  <button onClick={() => handleComment(post._id, comments[post._id])}>
                    {post?.comments?.some((comment) => comment?.userId === user?.userId) ? 'Update Comment' : <>
                      <div style={{ fontSize: '20px' }}>
                        <AiOutlinePlusCircle style={{ fill: 'gray' }} />
                      </div>
                    </>}
                  </button>
                </div>
              </div>
            }
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default Feed;
