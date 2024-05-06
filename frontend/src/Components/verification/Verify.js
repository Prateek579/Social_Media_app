import React, { useContext, useRef, useState } from "react";
import "./verify.css";
import { useNavigate } from "react-router-dom";
import dataContext from "../../ContextApi/Data";

const Verify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to hold OTP digits
  const otpInputs = useRef([]); // Ref for OTP input fields

  const { serverOtp, setAlertMessage } = useContext(dataContext);

  const navigate = useNavigate();

  // Function to handle changes in OTP input fields
  const handleChange = (index, event) => {
    const newOtp = [...otp];
    newOtp[index] = event.target.value;
    setOtp(newOtp);
    // Focus next input field if available
    if (event.target.value !== "" && index < otp.length - 1) {
      otpInputs.current[index + 1].focus();
    } else if (event.target.value === "" && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  // Function to handle paste events in OTP input fields
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text/plain");
    const pastedOtp = pastedData.split("").slice(0, otp.length);
    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);
  };

  //matching the USER OTP and SERVER OTP
  const handleContinue = () => {
    const currentOtp = otp;
    const otpString = currentOtp.join("");
    const otpInteger = parseInt(otpString, 10);
    if (otp[5] !== "") {
      if (serverOtp === otpInteger) {
        navigate("/forgetPassword");
      } else {
        setAlertMessage("You entered wrong otp");
      }
    }
  };

  return (
    <div className="verify">
      <div className="verify_container">
        <p className="lg_heading">Confirm your email address</p>
        <p className="sm_heading">
          we have sent a 6-digit to email address *****@gmail.com
        </p>
        <p className="sm_heading">Enter below</p>
        <div className="otp_input">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onPaste={handlePaste}
              maxLength={1}
              ref={(input) => (otpInputs.current[index] = input)}
            />
          ))}
        </div>

        <button className="btn_con" onClick={() => handleContinue()}>
          Continue
        </button>
        <button className="btn_req">Request a new code</button>
      </div>
    </div>
  );
};

export default Verify;
