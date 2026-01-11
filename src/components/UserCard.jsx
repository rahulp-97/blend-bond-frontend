import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from '../utils/constants';
import { removeUserFromFeed } from "../redux-toolkit/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const feed = useSelector(store => store.feed);

  const handleSendRequest = async (status, userId) => {
    try {
      const response = await axios.post(`${BASE_URL}/request/sendRequest/${status}/${userId}`, {}, {
        withCredentials: true
      });
      dispatch(removeUserFromFeed(userId))
    } catch (error) {
      console.error(error?.data?.message || error?.response?.data?.message || error?.message);
    }
  };

  const disableBtn = window.location.pathname === '/profile' && 'btn-disabled';

  return (
    <div>
      <div className="card bg-base-300 w-96 shadow-sm sm:mb-16 rounded-3xl">
        <figure className="mt-4">
          <img
            className="w-[90%] h-100 object-cover rounded-2xl"
            src={user?.photoUrl || null}
            alt="profile photo"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{user?.firstName + " " + user?.lastName}, {user?.age}</h2>
          <p>
            {user?.about}
          </p>
          <div className="card-actions justify-center my-4">
            <button className={`btn bg-transparent text-red-500 border-red-500 hover:bg-red-500 hover:text-black hover:border-transparent rounded-xl ${disableBtn}`} onClick={() => handleSendRequest('ignored', user?._id)}>ignore</button>
            <button className={`btn bg-transparent border-[#A600FF] hover:bg-[#A600FF] hover:text-black hover:border-transparent rounded-xl ${disableBtn}`} onClick={() => handleSendRequest('interested', user?._id)}>interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
