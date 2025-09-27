import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux-toolkit/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import CustomLoader from "./CustomLoader";

const Login = () => {
  const [userInput, setUserInput] = useState({
    emailId: "rahulkprajapati97@gmail.com",
    password: "User@1278",
    firstName: "test",
    lastName: "last",
    age: '23',
    gender: 'male',
  });
  const [errMsg, setErrMsg] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(store => store.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const loggedinUser = await axios.post(`${BASE_URL}/login`, {
        emailId,
        password
      }, {
        withCredentials: true
      });
      localStorage.removeItem("auth");
      const loggedinUserData = loggedinUser?.data?.data;
      if (loggedinUserData?.isVerified) {
        dispatch(addUser(loggedinUserData));
        localStorage.setItem("auth", JSON.stringify(loggedinUserData));
        if (errMsg) {
          setErrMsg("");
        };
        setIsLoading(false);
        navigate("/", { replace: true });
      } else if (!loggedinUserData?.isVerified) {
        if (userData) {
          dispatch(removeUser());
        }
        localStorage.removeItem("auth");
        localStorage.setItem("unverified", JSON.stringify(loggedinUserData));
        if (errMsg) {
          setErrMsg("Please verify your email.");
        };
        setIsLoading(false);
        navigate(`/verify-existing?email=${encodeURIComponent(loggedinUserData?.emailId)}`, { replace: true });
      }
    } catch (error) {
      setIsLoading(false);
      setErrMsg(error?.response?.data?.message);
    }
  };

  const handleSignup = async (e) => {
    try {
      setIsLoading(true);
      const registeredUser = await axios.post(`${BASE_URL}/signup`, {
        ...userInput
      }, {
        withCredentials: true
      });
      const registeredData = registeredUser?.data?.data;

      if (userData) {
        dispatch(removeUser());
      }
      localStorage.removeItem("auth");
      localStorage.setItem("unverified", JSON.stringify(registeredData));
      setIsLoading(false);
      navigate(`/verification?email=${encodeURIComponent(registeredData?.emailId)}`, { replace: true });
    } catch (error) {
      setIsLoading(false);
      setErrMsg(error?.response?.data?.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput, [name]: value
    })
  };

  useEffect(() => {
    return () => {
      if(isLoading) {
        setIsLoading(false);
      }
    };
  }, []);

  const { firstName, lastName, emailId, password, age, gender } = userInput;


  return (
    <div className="flex justify-center w-full">
      {
        isLoading &&
        <CustomLoader />
      }
      <div className="card card-border bg-base-100 md:w-1/3 xl:w-1/4">
        <div className="card-body items-center">
          <h1 className="card-title md:text-2xl">{isLoginForm ? 'Log in' : 'Sign up'}</h1>

          {!isLoginForm && (<>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">First Name</legend>
              <input
                className="input"
                name="firstName"
                onChange={handleChange}
                placeholder="first name"
                type="text"
                value={firstName}
              />
            </fieldset>
            <fieldset className="fieldset w-full">
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
            <fieldset className="fieldset w-full">
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
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Gender</legend>
              <input
                className="input"
                name="gender"
                onChange={handleChange}
                placeholder="gender"
                type="text"
                value={gender}
              />
            </fieldset>
          </>)}

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Email</legend>
            <input
              className="input"
              name="emailId"
              onChange={handleChange}
              placeholder="email address"
              type="text"
              value={emailId}
            />
          </fieldset>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Password</legend>
            <input
              className="input"
              name="password"
              onChange={handleChange}
              placeholder="password"
              type="text"
              value={password}
            />
          </fieldset>
          {errMsg && <p className="text-xs text-red-500 font-thin">{errMsg}</p>}
          <div className="card-actions justify-center">
            <button className="btn btn-primary md:px-10" onClick={isLoginForm ? handleLogin : handleSignup}>
              {isLoginForm ? 'Login' : 'Sign up'}
            </button>
          </div>
          <p>OR</p>
          <span>{isLoginForm ? 'new user?' : 'already a registered user?'} <button className="text-green-300" onClick={() => setIsLoginForm(!isLoginForm)}>
            {isLoginForm ? 'register' : 'login'}
          </button></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
