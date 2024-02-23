import React, { useState, useEffect } from 'react';
import { AiOutlineLike, AiTwotoneLike } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModalView from "./Modal"
function SinglePost() {
  const { postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);

  useEffect(() => {
    fetch(`/apiposts/${postId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch post');
        }
      })
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        console.error('API request failed:', error);
        setErr(true);
      }
      );
  }, [postId]);

  const lastLike = post?.likes[post.likes.length - 1];

  if (err) {
    return <div className='h-[80vh]'>Post Not Found</div>
  }
  return (
    <div className='min-h-[80vh]'>
      {
        post ?
          <div className="my-4 p-4  rounded-lg w-full flex flex-col items-center justify-center">
            <div key={post._id} className="mb-4 p-4 border h-auto rounded-lg w-[90%]">

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
                  {post.isPremium ?
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

              <div className='flex flex-col border-t  '>
                <div className='flex items-center py-2'>
                  <div className="flex items-center cursor-pointer" title='Comments'>
                    <div style={{ fontSize: '20px' }}>
                      <BiCommentDetail />
                    </div>
                    <div className='ml-2'>
                      {post?.comments?.length}</div></div>
                  <div className='flex cursor-pointer items-center ml-4' title='Likes'>
                    <div style={{ fontSize: '20px' }}>
                      {post.likes.some((like) => like.userId === user.userId) ? (
                        <AiTwotoneLike style={{ transform: 'scaleX(-1)', fill: 'blue' }} />
                      ) : (
                        <AiOutlineLike style={{ transform: 'scaleX(-1)' }} />
                      )}
                    </div>
                    <div className='ml-2'>
                      {post.likes.length}
                    </div>
                  </div>

                </div>
                {post?.likes?.length > 0 && (
                  <div className=''>
                    {post?.likes?.length === 1 ? (
                      <>{lastLike?.username} liked</>
                    ) : (
                      <>
                        {lastLike?.username} and {post?.likes?.length - 1}{' '}
                        {post?.likes?.length - 1 === 1 ? 'other' : 'others'} liked
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            {post.comments.length > 0 ? <div className='flex flex-col w-[90%] justify-start py-2'><div className='flex w-full justify-start py-2'>All comments</div>
              <div className='w-full flex flex-col justify-between items-center'>
                {
                  post?.comments?.map((comment, index) => (
                    <div key={index} className="flex flex-col items-start border h-auto mt-4 py-2 p-4 rounded-lg justify-start w-full">
                      <div className="flex items-center border-b w-full py-2">
                        <div className='border rounded-full p-1'>
                          <img
                            src={"https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} // Replace with the URL of the user's avatar
                            alt={`${comment?.username}'s avatar`}
                            className="w-4 h-4 rounded-full object-cover cursor-pointer"
                          />
                        </div>
                        <div className="text-black font-bold text-sm cursor-pointer ml-2">{comment?.author?.firstname} {comment?.author?.lastname}</div>

                      </div>
                      <div className='text-sm font-light mt-2'>{comment?.text}</div>
                    </div>
                  ))
                }
              </div></div>
              : <div>No comments</div>
            }
            <ModalView isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
              <div className='bg-white w-[30%] rounded-lg h-auto p-4'>
                <div className='flex justify-end font-semibold cursor-pointer' onClick={() => setIsModalActive(false)}> X</div>
                <div className='border-b text-sm font-semibold text-black'>Post Liked By </div>
                {post?.likes?.length > 0 && <div>
                  {
                    post?.likes.map((like, index) => (
                      <div key={index} className='mt-2'>
                        <div className="flex items-center">
                          <div className='border rounded-full p-1'>
                            <img
                              src={"https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} // Replace with the URL of the user's avatar
                              alt={`${user?.username}'s avatar`}
                              className="w-4 h-4 rounded-full object-cover cursor-pointer"
                            />
                          </div>
                          <div className="text-black font-medium text-sm cursor-pointer ml-2">{like?.firstname} {like?.lastname}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>}

              </div>
            </ModalView>
          </div> : <div>Post not found</div>
      }

    </div>
  );
}

export default SinglePost;
