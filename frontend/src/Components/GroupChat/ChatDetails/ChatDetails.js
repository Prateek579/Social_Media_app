import React from "react";
import "./chatDetails.css";

const ChatDetails = () => {
  return (
    <div className="chatDetails">
      <div className="chatDetails_header">
        <p>
          Chat Details <i className="fa-solid fa-xmark"></i>{" "}
        </p>
        <div className="chatDetails_option">
          <i className="fa-regular fa-image"></i>
          <i className="fa-solid fa-file-lines"></i>
          <i className="fa-solid fa-link"></i>
          <i className="fa-solid fa-bell"></i>
        </div> 
      </div>
      <p>Shared media</p>
      <div className="chatDetails_media">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjD5fTj9ZxrcHQii4jPES8GetuJo4D5ck0bw&usqp=CAU"
          alt="media"
        />
        <img
          src="https://images.indianexpress.com/2021/07/handshake-memes.jpg?w=414
        "
          alt="media"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjD5fTj9ZxrcHQii4jPES8GetuJo4D5ck0bw&usqp=CAU"
          alt="media"
        />
        <img
          src="https://images.indianexpress.com/2021/07/handshake-memes.jpg?w=414
        "
          alt="media"
        />
      </div>
    </div>
  );
};

export default ChatDetails;
