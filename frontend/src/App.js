import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import Verify from "./Components/verification/Verify";
import GroupChat from "./Components/GroupChat/GroupChat";
import Trending from "./Components/Trending/Trending";
import Profile from "./Components/Profile/Profile";
import SignIn from "./Components/signIn/SignIn";
import Alert from "./Components/Alert/Alert";
import DataState from "./ContextApi/DataState";
import ForgetPass from "./Components/ForgetPassword/ForgetPass";
import Spinner from "./Components/Spinner/Spinner";

function App() {
  return (
    <>
      <DataState>
        <Router>
          <Alert />
          <Spinner />
          <Routes>
            <Route exact path="/*" element={<SignIn />} />
            <Route exact path="/create" element={<Login />} />
            <Route exact path="/verify" element={<Verify />} />
            <Route exact path="/forgetPassword" element={<ForgetPass />} />
            <Route exact path="/home" element={<Home />}></Route>
            <Route exact path="/groupchat" element={<GroupChat />} />
            <Route exact path="/trending" element={<Trending />} />
            <Route exact path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </DataState>
    </>
  );
}

export default App;
