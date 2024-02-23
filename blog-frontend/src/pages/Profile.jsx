import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import { Link } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { ImCross } from "react-icons/im"
import ModalView from '../components/Modal';
import {notifySuccess,notifyError,notifyWarning} from "../components/Notify"
function Profile() {
  const { user, updateUserData, getToken } = useAuth();
  const [isModalActive, setIsModalActive] = useState(false);
  const [premiumUser, setPremiumUser] = useState(user.isPremium);

  const handleModal = () => {
    setIsModalActive(true);
  }

  const fetchUserDetails = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        updateUserData(userData);
        setPremiumUser(userData.isPremium)
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const handleSubscribe = () => {
    const token = user.token;

    fetch(`/apiusers/${user.userId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Subscribed to premium successfully.');
          return response.json();
        } else {
          console.error('Failed to subscribe to premium');
          throw new Error('Failed to subscribe to premium');
        }
      })
      .then((userData) => {
        notifySuccess('Subscribed to Premium')
        updateUserData(userData.user);
        setPremiumUser(userData.user.isPremium)
      })
      .catch((error) => console.error('API request failed:', error));
  };

  useEffect(() => {
    fetchUserDetails(user.userId);
  }, []);

  return (
    <div className='w-full flex justify-center items-center overflow-hidden'>
      <div className='w-[90%] flex items-center justify-between h-[81vh] '>
        {/* <Link to="/">Go back</Link> */}
        <div className='w-[40%] h-[300px] justify-center flex flex-col items-center'>
          <div className="user-details-card w-full h-full border   border-gray-200 pb-4 rounded-lg justify-center flex flex-col items-center">
            <div className='bg-purple-400 w-full h-[50%] flex justify-center items-center'>
              <div className="mt-4">
                <img
                  src={"https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} // Replace with the URL of the user's avatar
                  alt={`${user?.username}'s avatar`}
                  className="w-20 h-20 rounded-full object-cover cursor-pointer"
                />
              </div>
            </div>
            <div className='h-[50%]  flex flex-col justify-between'>
              <div>
                <div className='flex'>
                  <div className="text-xl  mb-2 cursor-pointer">
                    Full name:
                  </div>
                  <div className="text-xl font-semibold mb-2 cursor-pointer ml-2">
                    {user?.firstname} {user?.lastname}
                  </div>
                </div>
                <div className='flex'>
                  <div className="text-xl  mb-2 cursor-pointer">
                    Username:
                  </div>
                  <div className="text-xl font-semibold mb-2 cursor-pointer ml-2">
                    {user?.username}
                  </div>
                </div>
              </div>
              <div>
                {
                  premiumUser ? (
                    <div className='h-8 cursor-pointer px-4 bg-white flex justify-evenly items-center border border-yellow-500 rounded-3xl'>
                      <div className='text-yellow-500 font-semibold'>Premium  User</div>
                      <div >
                        <BsStars style={{ color: "rgb(234 179 8)" }} />
                      </div>
                    </div>
                  ) : (
                    <div className='h-8 cursor-pointer px-4 bg-white flex justify-evenly items-center border border-green-500 rounded-3xl' onClick={handleSubscribe} >
                      <div className='text-green-500 font-semibold' >Subscribe to Premium</div>
                      <div >
                        <BsStars style={{ color: "rgb(34 197 94)" }} />
                      </div>
                    </div>

                  )
                }
              </div>
            </div>
          </div>
          <div className='flex pt-8'>
            <button onClick={handleModal} className='p-4  bg-pink-300 rounded-lg'>Add New Post</button>
            {/* <button onClick={handleSubscribe} className='p-4  bg-pink-300 rounded-lg'>Subscribe to Premium</button> */}
          </div>
        </div>
        <div className='flex justify-between w-[50%] py-4  flex-col '>

          <ModalView isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
            <div className='w-[40%] bg-white border border-gray-200 rounded-lg p-4'>
              <div className='w-full flex items-end justify-end font-semibold cursor-pointer' onClick={() => setIsModalActive(false)}>X</div>
              <CreatePost />
            </div>
          </ModalView>
          <div className=" h-[70vh] overflow-y-scroll">
            <PostList />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
