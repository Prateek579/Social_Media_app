import React, { useContext, useEffect, useRef, useState } from "react";
import "./message.css";
import dataContext from "../../../ContextApi/Data";
import io from "socket.io-client";
const socket = io(process.env.REACT_APP_PORT_URI, {
  transports: ["websocket"],
});

const Message = () => {
  const {
    groupDetails,
    loginUserData,
    setLoginUserData,
    setAlertMessage,
    setSpinner,
  } = useContext(dataContext);

  const [text, setText] = useState("");
  const [showJoinBtn, setShowJoinBtn] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const containerRef = useRef(null);

  //requestiog for updating the message in database
  const handleMessage = async (e) => {
    e.preventDefault();
    const data = {
      text: text,
      sender: loginUserData.id,
      senderName: loginUserData.name,
    };
    socket.emit("new message", groupDetails[0].roomId, data);
    const newMessage = {
      text: text,
      sender: loginUserData.id,
    };
    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/channel/updateMessage`,
        {
          method: "PUT",
          headers: {
            "auth-token": loginUserData.token,
          },
          body: JSON.stringify({
            channelId: groupDetails[0]._id,
            message: text,
            senderName: loginUserData.name,
          }),
        }
      );
      const response = await request.json();
      console.log("handle message response is", response);

      if (response.success === true) {
        setText("");
      } else {
        setAlertMessage(response.message);
      }
    } catch (error) {
      console.log("handle message error", error);
    }
  };

  //making request to the server for joining the group
  const handleJoinGroup = async () => {
    setSpinner(true);
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/channel/addMember`,
        {
          method: "PUT",
          headers: {
            "auth-token": loginUserData.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ channelId: groupDetails[0]._id }),
        }
      );
      const response = await request.json();
      console.log("handleJoinGroup response is", response);
      setSpinner(false);
      if (response.success === true) {
        socket.emit("new member", groupDetails[0].roomId, loginUserData.name);
        setShowJoinBtn(false);
      } else {
        setAlertMessage(response.message);
      }
    } catch (error) {
      console.log("handleJoinGroup error", error);
      setSpinner(false);
    }
  };

  const findingMember = () => {
    //checking the user is member of group or not
    const members = groupDetails[0].members;
    const alreadyMember = members.filter((item) => item === loginUserData.id);
    if (alreadyMember.length === 0) {
      setShowJoinBtn(true);
    } else {
      setShowJoinBtn(false);
    }
  };

  //stablishing the connection between server and client using socket.ioclien
  const socketConnection = () => {
    socket.emit("joinRoom", groupDetails[0].roomId);
  };

  useEffect(() => {
    socketConnection();

    socket.on("joined member", (name) => {
      console.log("joined member", name);
      const newMessage = {
        senderName: name,
        text: "joined the group",
      };
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("receive message", (data) => {
      console.log("receive message", data);
      setAllMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      // Clean up socket event listeners
      socket.off("joined member");
      socket.off("receive message");
    };
  }, []);

  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem("loginUserData"));
    setLoginUserData({
      ...loginUserData,
      name: loginUser.name,
      token: loginUser.token,
      id: loginUser.id,
    });
    findingMember();
    socketConnection();
    setAllMessages(groupDetails[0].messages);
  }, [groupDetails]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <div className="message_container">
      {groupDetails.length === 0 ? (
        ""
      ) : (
        <>
          <div className="message_header">
            <div className="message_user_details">
              <img src={groupDetails[0].photo} alt="user" />
              <p>{groupDetails[0].name}</p>
            </div>
            <div className="message_user_call">
              <i className="fa-solid fa-phone"></i>
              <i className="fa-solid fa-video"></i>
            </div>
          </div>
          <div className="message_content" ref={containerRef}>
            {groupDetails.length === 0 ? (
              ""
            ) : (
              <>
                {" "}
                {allMessages.map((element, index) => {
                  return (
                    <>
                      {element.sender === loginUserData.id ? (
                        <div className="message_sender">
                          <p>{element.text}</p>
                        </div>
                      ) : (
                        <div className="message_receiver">
                          <div className="message_senderName">
                            {element.senderName}
                          </div>
                          <p>{element.text}</p>
                        </div>
                      )}
                    </>
                  );
                })}
              </>
            )}
          </div>
          <div className="message_inputes">
            {showJoinBtn === false ? (
              <form onSubmit={(e) => handleMessage(e)}>
                <input
                  type="text"
                  placeholder="type here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            ) : (
              <div className="message_join_btn">
                <button onClick={() => handleJoinGroup()}>Join Group</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
