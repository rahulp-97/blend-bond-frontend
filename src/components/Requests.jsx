import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../redux-toolkit/requestSlice';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector(store => store.requests);


  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true
      });
      dispatch(addRequests(response?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  const reviewRequest = async (status, reqId) => {
    try {
      const response = await axios.post(`${BASE_URL}/request/reviewRequest/${status}/${reqId}`, {}, {
        withCredentials: true
      });
      dispatch(removeRequest(reqId));
    } catch (error) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return;
  };

  if (requests?.length === 0) {
    return (
      <h1 className="text-sm sm:text-lg mt-6 text-center">No requests found!</h1>
    );
  };

  return (
    <div className="my-10 sm:w-1/2 mx-auto">
      <h1 className="text-lg sm:text-2xl text-center font-extralight">
        REQUESTS
      </h1>
      {requests?.map((req) => {
        const {
          reqId,
          userId,
          firstName,
          lastName,
          age,
          gender,
          photoUrl,
          about,
          hobbies,
        } = req;
        return (
          <div key={userId} className="m-4 p-4 rounded-3xl bg-base-200">
            <div className="flex items-center">
              <div className='w-[20%]'>
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full"
                  src={photoUrl}
                />
              </div>
              <div className="w-[40%]">
                <div className="text-lg font-semibold">
                  {firstName + " " + lastName}
                </div>
                {age && gender && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
              <div className='w-[40%]'>
                <button className='btn btn-primary mx-2 rounded-full' onClick={() => reviewRequest("accepted", reqId)}>Accept</button>
                <button className='btn btn-secondary mx-2 rounded-full' onClick={() => reviewRequest("rejected", reqId)}>Reject</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Requests;