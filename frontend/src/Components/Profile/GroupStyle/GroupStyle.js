import React, { useContext } from "react";
import "./groupStyle.css";
import dataContext from "../../../ContextApi/Data";

const GroupStyle = ({ group, fetchGroup }) => {
  const { loginUserData, setAlertMessage, setSpinner } =
    useContext(dataContext);

  //deleting the GROUP
  const handleDeleteGroup = async (channelId) => {
    setSpinner(true);
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/channel/deleteChannel`,
        {
          method: "DELETE",
          headers: {
            "auth-token": loginUserData.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ channelId }),
        }
      );
      const response = await request.json();
      setSpinner(false);
      if (response.success === true) {
        fetchGroup();
      } else {
        setAlertMessage(response.message);
      }
    } catch (error) {
      setSpinner(false);
      console.log("deleteGRoup error", error);
    }
  };

  return (
    <div className="groupStyle">
      <img src={group.photo} alt="user" />
      <div className="groupStyle_details">
        <p className="groupStyle_name">{group.name}</p>
        <p className="groupStyle_last_message">{group.description}</p>
      </div>
      <i
        className="fa-regular fa-trash-can"
        onClick={() => handleDeleteGroup(group._id)}
      ></i>
    </div>
  );
};

export default GroupStyle;
