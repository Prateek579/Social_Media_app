import React, { useContext, useEffect } from "react";
import "./spinner.css";
import dataContext from "../../ContextApi/Data";

const Spinner = () => {
  const { spinner } = useContext(dataContext);

  useEffect(() => {}, [spinner]);

  return (
    <>
      {spinner === false ? (
        ""
      ) : (
        <div className="spinner_container">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Spinner;
