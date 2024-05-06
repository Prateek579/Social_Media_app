import React, { useContext, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import dataContext from "../../ContextApi/Data";

const Login = () => {
  const navigate = useNavigate();
  const [display, setDisplay] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [passColor, setPassColor] = useState("black");
  const [verifyPass, setVerifyPass] = useState(false);

  const { setAlertMessage, setLoginUserData, setSpinner } =
    useContext(dataContext);

  const passwordHandler = (state) => {
    setDisplay(state);
  };

  const handleInputs = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const checkPassword = (e) => {
    if (e.target.value === details.password) {
      setPassColor("#45f248");
      setVerifyPass(true);
    } else {
      setPassColor("#ee6b6e");
    }
  };

  //handle the user input data and CREATE NEW USER
  const handleLogin = async () => {
    setSpinner(true);
    const inputEmail = details.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(inputEmail);
    if (
      details.name !== "" &&
      details.email !== "" &&
      details.password !== ""
    ) {
      if (isValidEmail) {
        const request = await fetch(
          `${process.env.REACT_APP_PORT_URI}/api/user/createUser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: details.name,
              email: details.email,
              password: details.password,
            }),
          }
        );
        const response = await request.json();
        console.log("handle create user response is", response);
        setSpinner(false);
        if (response.success === true) {
          setLoginUserData({
            name: details.name,
            token: response.authToken,
          });
          localStorage.setItem(
            "loginUserData",
            JSON.stringify({ name: response.name, token: response.authToken, id:response.id })
          );
          navigate("/home");
        } else {
          setAlertMessage(response.message);
        }
      } else {
        setSpinner(false);
        setAlertMessage("Please provide a valid email");
      }
    } else {
      setSpinner(false);
      setDetails({ name: "", email: "", password: "" });
      setAlertMessage("All fields are required");
    }
  };

  return (
    <div className="login">
      <div className="login_container">
        <p className="header">Create an account</p>
        <p className="sm_header">To continue, fill out your personal info</p>
        <div className="detail">
          Full name
          <label>
            <input
              type="text"
              placeholder="xyz"
              name="name"
              value={details.name}
              onChange={(e) => handleInputs(e)}
            />
          </label>
        </div>
        <div className="detail">
          E-mail
          <label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              name="email"
              value={details.email}
              onChange={(e) => handleInputs(e)}
            />
          </label>
        </div>
        <div className="detail">
          Password
          <label>
            <input
              type={display === false ? "password" : "text"}
              placeholder="********"
              name="password"
              value={details.password}
              onChange={(e) => handleInputs(e)}
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

        <button className="login_btn" onClick={() => handleLogin()}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
