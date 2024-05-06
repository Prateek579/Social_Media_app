import React, { useContext, useEffect, useState } from "react";
import "./alert.css";
import dataContext from "../../ContextApi/Data";

const Alert = () => {
  const context = useContext(dataContext);
  const { alertMessage, setAlertMessage } = context;

  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  useEffect(() => {}, [alertMessage]);

  return (
    <>
      {alertMessage === "" ? (
        ""
      ) : (
        <div className="alert_content">
          <div className="alert_container">
            <div className="alert_top">
              <i className="fa-regular fa-circle-xmark"></i>
            </div>
            <div className="alert_bottom">
              <p>{alertMessage}</p>
              <div className="alert_close" onClick={() => handleCloseAlert()}>
                <i className="fa-solid fa-xmark"></i>
                <p>Close</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
