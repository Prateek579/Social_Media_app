import React, { useContext } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import dataContext from "../../ContextApi/Data";

const Header = () => {
  const { loginUserData } = useContext(dataContext);

  return (
    <div className="head_header">
      <div className="header_search">
        <Link to="/home" className="head_link">
          <div className="header_logo">Startup</div>
        </Link>
        <label>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Type in search" />
        </label>
      </div>
      <Link to="/profile" className="head_link">
        <div className="header_user">
          <p>{loginUserData.name}</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Db_rqnoHx4JMQ_C5IbAbrXlohbP8TwQ2Lw&usqp=CAU"
            alt="user"
          />
        </div>
      </Link>
    </div>
  );
};

export default Header;
