import React, { useContext } from "react";
import "./homeCont.css";
import dataContext from "../../../ContextApi/Data";

const HomeCont = ({ element }) => {
  const { loginUserData, setAlertMessage } = useContext(dataContext);

  const handleLike = async (postId) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/post/likePost`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": loginUserData.token,
          },
          body: JSON.stringify({ postId }),
        }
      );
      const response = await request.json();
      if(response.success === true){
         
      }
      else  {
        setAlertMessage(response.message);
      }
    } catch (error) {
      console.log("handleLike error", error);
    }
  };

  return (
    <div className="homeCont_cards">
      <div className="homeCont_card">
        <div className="card_top">
          <img
            src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?size=626&ext=jpg&ga=GA1.1.34264412.1711324800&semt=sph"
            alt="user"
          />
          <div className="user_details">
            <p className="home_user_name">user name</p>
            <p className="user_date">{element.timestamp}</p>
          </div>
        </div>
        <div className="card_text">
          <p>{element.title}</p>
        </div>
        <div className="card_docs">
          {element.photos.length === 0 ? (
            ""
          ) : (
            <img src={element.photos} alt="card image" />
          )}
        </div>
        <div className="card_option">
          <div className="card_like">
            {element.likedBy.includes(loginUserData.token) ? (
              <i className="fa-solid fa-thumbs-up"></i>
            ) : (
              <i
                className="fa-regular fa-thumbs-up"
                onClick={() => handleLike(element._id)}
              ></i>
            )}
            Liked {element.likedBy.length}
          </div>
          <div className="card_comment">
            <i className="fa-solid fa-user-group"></i>Community
          </div>
          <div className="card_comment">
            <i className="fa-solid fa-paper-plane"></i>Share
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCont;
