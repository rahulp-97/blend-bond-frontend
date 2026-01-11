import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { isEmptyObject } from "../utils/utils";
import { removeUser } from "../redux-toolkit/userSlice";
import { addFeed } from "../redux-toolkit/feedSlice";
import { removeConnections } from "../redux-toolkit/connectionSlice";
import { addRequests } from "../redux-toolkit/requestSlice";

const Navbar = () => {
  const loggedinUser = useSelector((store) => store?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const closeDropdown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleLogout = async () => {
    try {
      closeDropdown();
      const response = await axios.get(`${BASE_URL}/logout`, {
        withCredentials: true,
      });
      if (response?.data?.status === "success") {
        localStorage.clear();
        dispatch(removeUser());
        dispatch(addFeed(null));
        dispatch(removeConnections());
        dispatch(addRequests([]));
        navigate("/login", { replace: true });
        // Disable back button
        setTimeout(() => {
          window.history.pushState(null, null, window.location.href);
          window.onpopstate = function() {
            window.history.pushState(null, null, window.location.href);
          };
        }, 0);
      }
    } catch (error) {
      console.error(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login", { replace: true });
    }
  }, [loggedinUser]);

  return (
    <div className="navbar bg-black shadow-sm mb-6">
      <div className="flex-1 mx-2">
        <Link
          style={{ textDecoration: "none" }}
          className="text-2xl text-[#A600FF]"
          to="/"
        >
          blendbond
        </Link>
      </div>
      <div className="flex gap-2">
        {/* <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        /> */}
        {loggedinUser && !isEmptyObject(loggedinUser) && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="profile pic" src={loggedinUser?.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-black text-white rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li onClick={closeDropdown}>
                <Link className="justify-between" to="/profile">
                  Profile
                </Link>
              </li>
              <li onClick={closeDropdown}>
                <Link to="/connections">Connections</Link>
              </li>
              <li onClick={closeDropdown}>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <span onClick={handleLogout}>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
