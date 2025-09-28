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
    <div className="my-10 w-1/2 mx-auto">
      <h1 className="text-lg sm:text-2xl text-center font-extralight">
        CONNECTIONS
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
            <div className="flex justify-between">
              <div>
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full"
                  src={photoUrl}
                />
              </div>
              <div className="mx-4">
                <div className="text-lg font-semibold">
                  {firstName + " " + lastName}
                </div>
                {age && gender && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
              <div className="self-center">
                <button
                className="bg-transparent cursor-pointer hover:bg-white text-white font-semibold hover:text-black py-3 px-6 border border-white hover:border-transparent rounded-2xl"
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
