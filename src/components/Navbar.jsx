import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { isEmptyObject } from "../utils/utils";
import { removeUser } from "../redux-toolkit/userSlice";

const Navbar = () => {
  const loggedinUser = useSelector((store) => store?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/logout`, {
        withCredentials: true
      });
      if (response?.data?.status === "success") {
        localStorage?.removeItem("auth");
        dispatch(removeUser());
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="navbar bg-base-200 shadow-sm mb-6">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to='/'>BlendBond</Link>
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link className="justify-between" to='/profile'>
                  Profile
                </Link>
              </li>
              <li>
                <Link to='/connections'>Connections</Link>
              </li>
              <li>
                <Link to='/requests'>Requests</Link>
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
