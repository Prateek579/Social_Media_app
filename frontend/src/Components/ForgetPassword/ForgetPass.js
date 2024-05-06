import React, { useContext, useState } from "react";
import "./forgetPass.css";
import { useNavigate } from "react-router-dom";
import dataContext from "../../ContextApi/Data";

const ForgetPass = () => {
  const navigate = useNavigate();
  const [display, setDisplay] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passColor, setPassColor] = useState("black");

  const { resetPassEmail, setAlertMessage } = useContext(dataContext);

  // function used to convert the input type between text and password
  const passwordHandler = (state) => {
    setDisplay(state);
  };

  const checkPassword = (e) => {
    if (e.target.value === inputPassword) {
      setPassColor("#45f248");
    } else {
      setPassColor("#ee6b6e");
    }
  };

  const handleResetPassword = async () => {
    if (inputPassword !== "") {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/user/resetPassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resetPassEmail,
            password: inputPassword,
          }),
        }
      );
      const response = await request.json();
      if (response.success === true) {
        navigate("/home");
      } else {
        setInputPassword("");
        setAlertMessage(response.message);
      }
    } else {
      setInputPassword("");
      setAlertMessage("All fields are required");
    }
  };

  return (
    <div className="forget">
      <div className="forget_container">
        <p className="header">Forget Password</p>
        <div className="detail">
          E-mail
          <label>
            <input type="email" value={resetPassEmail} disabled />
          </label>
        </div>
        <div className="detail">
          Password
          <label>
            <input
              type={display === false ? "password" : "text"}
              placeholder="********"
              name="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            {display === false ? (
              <i
                onClick={() => passwordHandler(true)}
                className="fa-solid fa-eye-slash"
              ></i>
            ) : (
              <i
                onClick={() => passwordHandler(false)}
                className="fa-regular fa-eye"
              ></i>
            )}
          </label>
        </div>
        <div className="detail">
          Repeat password
          <label>
            <input
              type="password"
              placeholder="********"
              onChange={(e) => checkPassword(e)}
              style={{ color: passColor }}
            />
          </label>
        </div>

        <button className="forget_btn" onClick={() => handleResetPassword()}>
          Forget Password
        </button>
      </div>
    </div>
  );
};

export default ForgetPass;
