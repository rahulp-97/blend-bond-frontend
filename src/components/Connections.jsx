import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addConnections,
  removeConnections,
} from "../redux-toolkit/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
  try {
      const response = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      if(response && response?.data?.data?.length > 0) {
        dispatch(addConnections(response?.data?.data));
      }
    } catch (err) {
      if (err?.status === 401) {
        Navigate("/login");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

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
      {connections.map((conn) => {
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
            <div className="flex">
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
