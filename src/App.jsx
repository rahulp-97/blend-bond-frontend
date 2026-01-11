import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider, useDispatch } from "react-redux";
import appStore from "./redux-toolkit/appStore";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Verification from "./components/Verification";
import VerifyExisting from "./components/VerifyExisting";
import Chat from "./components/Chat";
import { useEffect, useState } from "react";
import { addUser } from "./redux-toolkit/userSlice";

function AppContent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const user = JSON.parse(savedAuth);
        dispatch(addUser(user));
      } catch (e) {
        localStorage.removeItem("auth");
      }
    }
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="loading loading-spinner loading-lg"></div></div>;
  }

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="/" element={<Feed />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/chat/:targetUserId" element={<Chat />} />
        </Route>
        <Route path="/verification" element={<Verification />} />
        <Route path="/verify-existing" element={<VerifyExisting />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <>
      <Provider store={appStore}>
        <AppContent />
      </Provider>
    </>
  );
}

export default App;
