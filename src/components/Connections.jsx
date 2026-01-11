import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {
  addConnections,
  removeConnections,
} from "../redux-toolkit/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      if (response && response?.data?.data?.length > 0) {
        dispatch(addConnections(response?.data?.data));
      }
    } catch (err) {
      if (err?.status === 401) {
        navigate("/login");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleChatClick = (userId) => {
    if(!userId) {
      return;
    }
    navigate(`/chat/${userId}`);
  };

  if (!connections) {
    return;
  }
  if (connections?.length === 0) {
    return (
      <h1 className="text-sm sm:text-lg mt-6 text-center">No connections found!</h1>
    );
  }

  return (
    <div className="my-1 sm:my-3 w-full sm:w-1/2 mx-auto">
      <h1 className="text-lg sm:text-2xl text-center font-extralight">
        connections
      </h1>
      {connections?.map((conn) => {
        const {
          userId,
          firstName,
          lastName,
          age,
          gender,
          photoUrl,
          about,
          skills,
        } = conn;
        return (
          <div key={userId} className="m-4 p-4 rounded-3xl bg-base-200">
            <div className="flex flex-row justify-between items-start">
              <div className="mb-0">
                <img
                  alt="photo"
                  className="w-12 h-12 sm:w-20 sm:h-20 rounded-full mx-auto sm:mx-0"
                  src={photoUrl}
                />
              </div>
              <div className="mx-4 text-center sm:text-left">
                <div className="text-sm sm:text-lg font-semibold">
                  {firstName + " " + lastName}
                </div>
                <span className="text-xs sm:text-lg">
                  {age && gender && <p>{age + ", " + gender}</p>}
                </span>
                <p>{about}</p>
              </div>
              <div className="mt-0 sm:mt-0 sm:self-center">
                <button
                className="bg-transparent cursor-pointer hover:bg-white text-white font-semibold hover:text-black py-2 px-4 sm:py-3 sm:px-6 border border-white hover:border-transparent rounded-2xl"
                onClick={() => handleChatClick(userId)}
              >
                message
              </button>
              </div>
            </div>
            <div>
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default Connections;
