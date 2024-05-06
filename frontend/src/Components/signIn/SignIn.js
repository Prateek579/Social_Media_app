import React, { useContext, useState } from "react";
import "./signIn.css";
import { Link, useNavigate } from "react-router-dom";
import dataContext from "../../ContextApi/Data";

const SignIn = () => {
  const [display, setDisplay] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const {
    setAlertMessage,
    setServerOtp,
    setResetPassEmail,
    setLoginUserData,
    setSpinner,
  } = useContext(dataContext);

  const navigate = useNavigate();

  const passwordHandler = (state) => {
    setDisplay(state);
  };

  //updating the useState for storing the credentials
  const handleInputs = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  //login the existing user with email and password
  const handleSignIn = async () => {
    setSpinner(true);
    const inputEmail = credentials.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(inputEmail);
    if (
      credentials.name !== "" &&
      credentials.email !== "" &&
      credentials.password !== ""
    ) {
      if (isValidEmail) {
        try {
          const respose = await fetch(
            `${process.env.REACT_APP_PORT_URI}/api/user/loginUser`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          const json = await respose.json();
          setSpinner(false);
          if (json.success === true) {
            setLoginUserData({
              name: json.name,
              token: json.authToken,
              id: json.id,
            });
            localStorage.setItem(
              "loginUserData",
              JSON.stringify({
                name: json.name,
                token: json.authToken,
                id: json.id,
              })
            );
            navigate("/home");
          } else {
            setAlertMessage(json.message);
          }
        } catch (error) {
          setSpinner(false);
          console.log("handle signIn error", error.response);
        }
      } else {
        setSpinner(false);
        setAlertMessage("Please provide a valid email");
      }
    } else {
      setSpinner(false);
      setCredentials({ name: "", email: "", password: "" });
      setAlertMessage("All fields are required");
    }
  };

  // requesting to the server to generate the OTP for password reset
  const handleForget = async () => {
    setSpinner(true);
    const inputEmail = credentials.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(inputEmail);
    if (setCredentials.email !== "" && isValidEmail) {
      try {
        const respose = await fetch(
          `${process.env.REACT_APP_PORT_URI}/api/user/sendCode`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
            }),
          }
        );
        const json = await respose.json();
        setSpinner(false);
        if (json.success === true) {
          setServerOtp(json.code);
          setResetPassEmail(credentials.email);
          navigate("/home");
        } else {
          setAlertMessage(json.message);
        }
      } catch (error) {
        setSpinner(false);
        console.log("request otp error", error);
      }
      navigate("/verify");
    } else {
      setSpinner(false);
      setAlertMessage("Firstly provide a valid email");
    }
  };

  return (
    <div className="signIn">
      <div className="signIn_container">
        <p className="header">Login an account</p>
        <p className="sm_header">To continue, fill out your personal info</p>
        <div className="detail">
          Full name
          <label>
            <input
              type="text"
              placeholder="xyz"
              name="name"
              value={credentials.name}
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
              value={credentials.email}
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
              value={credentials.password}
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

        <button className="signIn_btn" onClick={() => handleSignIn()}>
          Continue
        </button>
        <div className="signIn_options">
          <Link to="/create" className="signIn_Link">
            <button className="signIn_opt">Don't have account</button>
          </Link>
          <div className="signIn_Link" onClick={() => handleForget()}>
            <button className="signIn_opt">Forget password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
