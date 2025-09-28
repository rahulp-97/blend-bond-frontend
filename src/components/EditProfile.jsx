import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { isPageReloaded } from "../utils/utils";
import { useDispatch } from "react-redux";
import { addUser } from "../redux-toolkit/userSlice";

const EditProfile = ({ userProfile }) => {
  const [profileData, setProfileData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    age: userProfile?.age || "",
    about: userProfile?.about || "",
    photoUrl: userProfile?.photoUrl || "",
    hobbies: userProfile?.hobbies || "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const { firstName, lastName, age, about, photoUrl, hobbies } = profileData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          ...profileData,
          gender: userProfile?.gender
        },
        {
          withCredentials: true,
        }
      );
      const updatedAuth = {
        ...profileData,
        emailId: userProfile?.emailId,
        gender: userProfile?.gender
      };
      localStorage.removeItem("auth");
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
      dispatch(addUser(response?.data?.data));
      setErrMsg("");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setErrMsg(err?.response?.data);
    }
  };

  useEffect(() => {
    if (isPageReloaded()) {
      setProfileData({
        firstName: userProfile?.firstName || "",
        lastName: userProfile?.lastName || "",
        age: userProfile?.age || "",
        about: userProfile?.about || "",
        photoUrl: userProfile?.photoUrl || "",
        hobbies: userProfile?.hobbies || "",
      });
    }
  }, [userProfile]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-center w-full">
        <div className="w-full sm:w-1/3 order-2 sm:order-1">
          <div className="card card-border bg-base-100 w-full">
            <div className="card-body">
              <h1 className="card-title md:text-2xl font-extralight">Profile</h1>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  className="input"
                  name="firstName"
                  onChange={handleChange}
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  className="input"
                  name="lastName"
                  onChange={handleChange}
                  placeholder="last name"
                  type="text"
                  value={lastName}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Image url</legend>
                <input
                  className="input"
                  name="photoUrl"
                  onChange={handleChange}
                  placeholder="image url"
                  type="text"
                  value={photoUrl}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Age</legend>
                <input
                  className="input"
                  name="age"
                  onChange={handleChange}
                  placeholder="age"
                  type="text"
                  value={age}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">About</legend>
                <input
                  className="input"
                  name="about"
                  onChange={handleChange}
                  placeholder="about"
                  type="text"
                  value={about}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">hobbies</legend>
                <input
                  className="input"
                  name="hobbies"
                  onChange={handleChange}
                  placeholder="hobbies"
                  type="text"
                  value={hobbies}
                />
              </fieldset>

              {errMsg && (
                <p className="text-xs text-red-500 font-thin">{errMsg}</p>
              )}
              <div className="card-actions mt-3">
                <button
                  className="btn bg-[#A600FF] md:px-10 rounded-3xl"
                  onClick={handleUpdateProfile}
                >
                  update profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/3 order-1 sm:order-2">
          <h1 className="card-title md:text-2xl mt-0 sm:mt-6 font-light">Preview</h1>
          <div className="mt-0 sm:mt-2">
            <UserCard user={profileData} />
          </div>
        </div>
      </div>

      {showToast && (<div className="toast toast-top toast-center">
        <div className="alert alert-success">
          <span>Profile updated successfully!</span>
        </div>
      </div>)}
    </>
  );
};

export default EditProfile;
