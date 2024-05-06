import React, { useContext, useState } from "react";
import "./groupList.css";
import dataContext from "../../../ContextApi/Data";

const GroupList = ({ element }) => {
  const { setSpinner, setGroupDetails } = useContext(dataContext);

  //fetching the all message of group
  const fetchMessages = async (channelId) => {
    setSpinner(true);
    try {
      if (channelId) {
        const request = await fetch(
          `${process.env.REACT_APP_PORT_URI}/api/channel/channelMessages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ channelId }),
          }
        );
        const response = await request.json();
        setSpinner(false);
        if (response.success === true) {
          setGroupDetails(response.allMessages);
        }
      }
    } catch (error) {
      setSpinner(false);
      console.log("fetchMessage error", error);
    }
  };

  return (
    <div className="groupList" onClick={() => fetchMessages(element._id)}>
      <img src={element.photo} alt="user" />
      <div className="groupList_details">
        <p className="groupList_name">{element.name}</p>
        <p className="groupList_last_message">{element.description}</p>
      </div>
    </div>
  );
};

export default GroupList;
