import React, { useState } from "react";
import "./leftNavbar.css";
import { Link } from "react-router-dom";

const LeftNavbar = () => {
  const [hover, setHover] = useState("");

  return (
    <div className="home_leftbar_container">
      <ul>
        <li
          className={hover === "home" ? "home_selected" : ""}
          onClick={() => setHover("home")}
        >
          <i className="fa-solid fa-house"></i>Home
        </li>
        <Link to="/profile" className="home_link">
          <li
            className={hover === "profile" ? "home_selected" : ""}
            onClick={() => setHover("profile")}
          >
            <img
              src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
              alt="user image"
            />
            Profile
          </li>
        </Link>
      </ul>
      <h3>Favorities</h3>
      <ul>
        <Link to="/groupchat" className="link">
          <li
            className={hover === "message" ? "home_selected" : ""}
            onClick={() => setHover("message")}
          >
            <i className="fa-regular fa-comments"></i>Message
          </li>
        </Link>
        <Link to="/trending" className="link">
          <li
            className={hover === "trending" ? "home_selected" : ""}
            onClick={() => setHover("trending")}
          >
            <i className="fa-solid fa-arrow-trend-up"></i>Trending
          </li>
        </Link>
        <li
          className={hover === "friend" ? "home_selected" : ""}
          onClick={() => setHover("friend")}
        >
          <i className="fa-solid fa-user-group"></i>Friend
        </li>
        <li
          className={hover === "feed" ? "home_selected" : ""}
          onClick={() => setHover("feed")}
        >
          <i className="fa-solid fa-bars"></i>Feed
        </li>
        <li
          className={hover === "stories" ? "home_selected" : ""}
          onClick={() => setHover("stories")}
        >
          <i className="fa-solid fa-clapperboard"></i>Stories
        </li>
        <li
          className={hover === "events" ? "home_selected" : ""}
          onClick={() => setHover("events")}
        >
          <i className="fa-solid fa-gift"></i>Events
        </li>
        <li
          className={hover === "memories" ? "home_selected" : ""}
          onClick={() => setHover("memories")}
        >
          <i className="fa-solid fa-lightbulb"></i>Memories
        </li>
      </ul>
      <h3>Group</h3>
      <ul>
        <li>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_G20xgN_nv8fWRMcpkBx4xDrgLUhQph1AFEJ1NQ8NJXrRIBlQfXrgpJT3qFq4yjsHp4&usqp=CAU"
            alt="group image"
          />
          Dog Lovers
        </li>
      </ul>
    </div>
  );
};

export default LeftNavbar;
