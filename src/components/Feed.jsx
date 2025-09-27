import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../redux-toolkit/feedSlice';
import { removeUser } from '../redux-toolkit/userSlice';
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';


const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const feedData = useSelector(store => store.feed);
  const userData = useSelector(store => store.user);

  const getFeed = async () => {
    try{
      const response = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true
      });
      dispatch(addFeed(response?.data?.data));
    } catch(err) {
      if(err?.response?.data?.data === "unauthorized") {
        localStorage.removeItem("auth");
        localStorage.removeItem("unverified");
        dispatch(removeUser());
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    if(!userData) {
      navigate('/login');
    }
    else if(!feedData?.length) {
      getFeed();
    }
  }, []);


  return (
    <div className='items-center'>
      {feedData?.length > 0 && (<div className='flex justify-center'>
        <UserCard user={feedData?.[0]} />
      </div>)}
      {feedData?.length === 0 && (<h1 className='text-center mt-14 text-lg lg:text-2xl'>
        No users found for your location! Please try after sometime.
      </h1>)}
    </div>
  )
}

export default Feed;