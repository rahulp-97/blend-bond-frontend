import React from 'react'
import EditProfile from './EditProfile';
import { useSelector } from 'react-redux';

const Profile = () => {
  const userProfile = useSelector(store => store.user);
  return (
    <div className='sm:mb-20'>
      <EditProfile userProfile={userProfile} />
    </div>
  )
}

export default Profile;
