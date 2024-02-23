import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import { Link } from 'react-router-dom';
import { AiOutlineLike, AiOutlineRight } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';
import {notifySuccess,notifyError,notifyWarning} from "./Notify"
function PostList() {
  const { user } = useAuth();
  const { posts, updatePosts, postCreated, setPostCreationStatus } = usePost();

  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const handleDeletePost = (postId) => {
    const token = user.token;

    fetch(`/apiposts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((response) => {
        if (response.ok) {
          setInitialFetchDone(false);
          setPostCreationStatus(true);
          notifySuccess("Post deleted successfully")
        } else {
          throw new Error('Failed to delete the post');
         
        }
      })
      .catch((error) => {
        console.error('API request failed:', error)
        notifyError()(error)
    });
  };

  useEffect(() => {
    if (!initialFetchDone || postCreated) {
      const token = user.token;

      fetch(`/apiusers/${user.userId}/posts`, {
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
            throw Error('Failed to fetch posts');
          }
        })
        .then((data) => {
          updatePosts(data);
          setInitialFetchDone(true);
          setPostCreationStatus(false);
        })
        .catch((error) => console.error('API request failed:', error));
    }
  }, [postCreated, initialFetchDone, user.token, user.userId, updatePosts, setPostCreationStatus]);

  return (
    <div className="my-4 py-4  rounded-lg w-full">
      <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
      {posts[0] && posts[0]?.length > 0 ? (
        posts[0].map((post) => (
          <div key={post._id} className="mb-4 p-4 border rounded-lg w-full">

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

            <div className='flex border-t justify-between py-2'>
              {/* <div className="text-gray-600">Likes: {post.likes.length}</div> */}
              <div className='flex items-center'>
                <div className="flex items-center cursor-pointer" title='Comments'>
                  <div style={{ fontSize: '20px' }}>
                    <BiCommentDetail />
                  </div>
                  <div className='ml-2'>
                    {post?.comments?.length}</div></div>
                <div className='flex cursor-pointer items-center ml-4' title='Likes'>
                  <div style={{ fontSize: '20px' }}>
                    <AiOutlineLike style={{ transform: 'scaleX(-1)' }} />
                  </div>
                  <div className='ml-2'>
                    {post?.likes?.length}
                  </div>
                </div>

              </div>
              <div className='flex items-center'>
                <Link to={`/post/${post._id}`}>
                  Details
                </Link>
                <div style={{ fontSize: "20px" }}>
                  <AiOutlineRight />
                </div>
              </div>
              <div
                className='cursor-pointer text-red-600'
                onClick={() => handleDeletePost(post._id)}
              >
                Delete post
              </div>
            </div>



          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default PostList;
