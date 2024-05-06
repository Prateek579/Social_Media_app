import { useState } from "react";
import dataContext from "./Data";

const DataState = (props) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [resetPassEmail, setResetPassEmail] = useState("");
  const [loginUserData, setLoginUserData] = useState({
    name: "User Name",
    token: 0,
    id: 0,
  });
  const [groupDetails, setGroupDetails] = useState([]);

  return (
    <dataContext.Provider
      value={{
        alertMessage,
        setAlertMessage,
        serverOtp,
        setServerOtp,
        resetPassEmail,
        setResetPassEmail,
        loginUserData,
        setLoginUserData,
        spinner,
        setSpinner,
        groupDetails,
        setGroupDetails,
      }}
    >
      {props.children}
    </dataContext.Provider>
  );
};

export default DataState;
