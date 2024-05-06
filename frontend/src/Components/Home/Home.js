import React, { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import "./home.css";
import { Link } from "react-router-dom";
import HomeCont from "./HomeContent/HomeCont";
import Community from "./Community/Community";
import LeftNavbar from "../LeftNavbar/LeftNavbar";
import dataContext from "../../ContextApi/Data";

const Home = () => {
  const [hover, setHover] = useState("home");
  const [allPosts, setAllPosts] = useState([]);

  const { setLoginUserData, loginUserData, setAlertMessage } =
    useContext(dataContext);

  //requesting for all USER POSTS
  const getAllPosts = async (req, res) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/post/allPosts`,
        {
          method: "GET",
        }
      );
      const response = await request.json();
      if (response.success === true) {
        setAllPosts(response.allPosts);
      } else {
        setAlertMessage(response.message);
      }
    } catch (error) {
      console.log("getAllPosts error", error);
    }
  };

  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem("loginUserData"));
    setLoginUserData({
      ...loginUserData,
      name: loginUser.name,
      token: loginUser.token,
    });
    getAllPosts();
  }, []);

  return (
    <div className="home">
      <div className="home_header">
        <Header />
      </div>
      <div className="home_container">
        <div className="home_leftbar">
          <LeftNavbar />
        </div>

        {/* bottom navbar for smmalar screen */}
        <div className="bottom_navbar">
          <ul>
            <li
              className={hover === "home" ? "home_selected" : ""}
              onClick={() => setHover("home")}
            >
              <i className="fa-solid fa-house"></i>
            </li>
            <Link to="/profile" className="sm_link">
              <li
                className={hover === "profile" ? "home_selected" : ""}
                onClick={() => setHover("profile")}
              >
                <img
                  src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
                  alt="user image"
                />
              </li>
            </Link>

            <Link to="/groupchat" className="sm_link">
              <li
                className={hover === "message" ? "home_selected" : ""}
                onClick={() => setHover("message")}
              >
                <i className="fa-regular fa-comments"></i>
              </li>
            </Link>
            <li
              className={hover === "friend" ? "home_selected" : ""}
              onClick={() => setHover("friend")}
            >
              <i className="fa-solid fa-user-group"></i>
            </li>
            <li
              className={hover === "feed" ? "home_selected" : ""}
              onClick={() => setHover("feed")}
            >
              <i className="fa-solid fa-bars"></i>
            </li>
            <li
              className={hover === "stories" ? "home_selected" : ""}
              onClick={() => setHover("stories")}
            >
              <i className="fa-solid fa-clapperboard"></i>
            </li>
            <li
              className={hover === "events" ? "home_selected" : ""}
              onClick={() => setHover("events")}
            >
              <i className="fa-solid fa-gift"></i>
            </li>
            <li
              className={hover === "memories" ? "home_selected" : ""}
              onClick={() => setHover("memories")}
            >
              <i className="fa-solid fa-lightbulb"></i>
            </li>
          </ul>
        </div>
        <div className="home_content">
          {allPosts.map((element, index) => {
            return (
              <>
                <HomeCont element={element} key={element._id} />
              </>
            );
          })}
        </div>
        <div className="home_community">
          <Community />
        </div>
      </div>
    </div>
  );
};

export default Home;

{
  /* <Link to={"/groupchat"}>Group chat</Link>
      <Link to={"/trending"}>Trending</Link>
       */
}
