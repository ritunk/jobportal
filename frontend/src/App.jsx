import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Navbar from "./components/Layout/Navbar.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Application from "./components/Application/Application.jsx";
import MyApplication from "./components/Application/MyApplication.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Home from "./components/Home/Home.jsx";
import Jobs from "./components/Job/Jobs.jsx";
import JobDetails from "./components/Job/JobDetails.jsx";
import PostJob from "./components/Job/PostJob.jsx";
import MyJobs from "./components/Job/MyJobs.jsx";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          { withCredentials: true }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/job/getall" element={<Jobs />}></Route>
          <Route path="/job/:id" element={<JobDetails />}></Route>
          <Route path="/job/post" element={<PostJob />}></Route>
          <Route path="/job/me" element={<MyJobs />}></Route>
          <Route path="/application/:id" element={<Application />}></Route>
          <Route path="/application/me" element={<MyApplication />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
