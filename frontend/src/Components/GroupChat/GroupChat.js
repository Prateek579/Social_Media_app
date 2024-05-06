import React, { useContext, useEffect, useState } from "react";
import "./groupchat.css";
import Message from "./Message/Message";
import ChatDetails from "./ChatDetails/ChatDetails";
import { Link } from "react-router-dom";
import GroupList from "./GroupList/GroupList";
import dataContext from "../../ContextApi/Data";

const GroupChat = () => {
  const { setAlertMessage, setSpinner, groupDetails } = useContext(dataContext);

  const [groupList, setGroupList] = useState([]);
  const [groupSearch, setGroupSearch] = useState("");

  //fetching the group lists of user
  const fetchGroups = async () => {
    setSpinner(true);
    const loginUser = JSON.parse(localStorage.getItem("loginUserData"));
    const userToken = loginUser.token;
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/channel/userChannels`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        }
      );
      const response = await request.json();
      setSpinner(false);
      if (response.success === true) {
        setGroupList(response.channelList);
      } else {
        setAlertMessage(response.message);
      }
    } catch (error) {
      setSpinner(false);
      console.log("fetchGroup error", error);
    }
  };

  //making request to serarch the group with name
  const handleGroupSearch = async (e) => {
    setSpinner(true);
    e.preventDefault();
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/channel/searchChannel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupSearch }),
        }
      );
      const response = await request.json();
      setSpinner(false);
      if (response.success === true) {
        setGroupList(response.channelList);
      } else {
        setAlertMessage(response.message);
      }
    } catch (error) {
      console.log("handleGroupSearch error", error);
    }
    setSpinner(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="groupChat">
      <div className="groupChat_left">
        <Link to="/home" className="groupChat_link">
          <p>
            <i className="fa-solid fa-chevron-left"></i>Startup
          </p>
        </Link>
        <label>
          {" "}
          <form onSubmit={handleGroupSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search in chats"
              onChange={(e) => setGroupSearch(e.target.value)}
            />
          </form>
        </label>
        <div className="groups">
          {groupList.length === 0 ? (
            <p>Don't have any group</p>
          ) : (
            groupList.map((element, index) => {
              return <GroupList element={element} key={element._id} />;
            })
          )}
        </div>
      </div>
      <div className="groupChat_middle">
        {groupDetails.length === 0 ? "" : <Message />}
      </div>
      <div className="groupChat_right">
        <ChatDetails />
      </div>
    </div>
  );
};

export default GroupChat;
