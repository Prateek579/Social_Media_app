import React, { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import image from "./crowd.jpg";
import "./profile.css";
import HomeCont from "../Home/HomeContent/HomeCont";
import dataContext from "../../ContextApi/Data";
import GroupStyle from "./GroupStyle/GroupStyle";

const Profile = () => {
  const { setAlertMessage, loginUserData, setSpinner, setLoginUserData } =
    useContext(dataContext);
  const [groupDetais, setGroupDetails] = useState({
    name: "",
    description: "",
    type: "",
  });
  const [selectPhoto, setSelectPhoto] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [createPostTitle, setCreatePostTitle] = useState("");
  const [createPostPhoto, setCreatePostPhoto] = useState(null);
  const [allUserPosts, setAllUserPosts] = useState([]);

  //update the details of GROUPDETAILS
  const handleGroupDetails = (e) => {
    setGroupDetails({
      ...groupDetais,
      [e.target.name]: e.target.value,
    });
  };

  //making request to backend for creating a new GROUP
  const handleCreateGroup = async () => {
    if (
      groupDetais.name !== "" &&
      groupDetais.description !== "" &&
      groupDetais.type !== "" &&
      groupDetais.photo !== null
    ) {
      setSpinner(true);
      const formData = new FormData();
      formData.append("photo", selectPhoto);
      formData.append("name", groupDetais.name);
      formData.append("description", groupDetais.description);
      formData.append("type", groupDetais.type);
      try {
        const request = await fetch(
          `${process.env.REACT_APP_PORT_URI}/api/channel/createChannel`,
          {
            method: "POST",
            headers: {
              "auth-token": loginUserData.token,
            },
            body: formData,
          }
        );
        const response = await request.json();
        setSpinner(false);
        if (response.success === true) {
          fetchGroups();
        } else {
          setAlertMessage(response.message);
        }
      } catch (error) {
        setSpinner(false);
      }
    } else {
      setAlertMessage("Fill all the fields");
    }
  };

  //fetching the group lists of user
  const fetchGroups = async () => {
    setSpinner(true);
    const loginUser = JSON.parse(localStorage.getItem("loginUserData"));
    const userToken = loginUser.token;
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/channel/userChannels`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        }
      );
      const response = await request.json();
      setSpinner(false);
      if (response.success === true) {
        setGroupList(response.channelList);
      } else {
        setAlertMessage(response.message);
      }
    } catch (error) {
      setSpinner(false);
      console.log("fetchGroup error", error);
    }
  };

  //making request to server for creating new post
  const handleCreatePost = async () => {
    setSpinner(true);
    if (createPostTitle === "" || createPostPhoto === null) {
      setSpinner(false);
      setAlertMessage("All fields is mendatory");
    } else {
      const formData = new FormData();
      formData.append("photo", createPostPhoto);
      formData.append("title", createPostTitle);
      try {
        const request = await fetch(
          `${process.env.REACT_APP_PORT_URI}/api/post/newPost`,
          {
            method: "POST",
            headers: {
              "auth-token": loginUserData.token,
            },
            body: formData,
          }
        );
        const response = await request.json();
        if (response.success === true) {
          getUserPosts();
        }
        setSpinner(false);
      } catch (error) {
        setSpinner(false);
        console.log("handleCreatePost error", error);
      }
    }
  };

  //requesting for all USER POSTS
  const getUserPosts = async (req, res) => {
    try {
      const loginUser = JSON.parse(localStorage.getItem("loginUserData"));
      const userToken = loginUser.token;
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/post/userPosts`,
        {
          method: "GET",
          headers: {
            "auth-token": userToken,
          },
        }
      );
      const response = await request.json();
      if (response.success === true) {
        setAllUserPosts(response.allPosts);
      }
    } catch (error) {
      console.log("getUserPosts error", error);
    }
  };

  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem("loginUserData"));
    setLoginUserData({
      ...loginUserData,
      name: loginUser.name,
      token: loginUser.token,
    });
    fetchGroups();
    getUserPosts();
  }, []);

  return (
    <div className="profile_container">
      <Header />
      <div className="profile_elements">
        <div className="profile_top">
          <img src={image} alt="background image" />
          <div className="profile_user_details">
            <img
              src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?size=626&ext=jpg&ga=GA1.1.34264412.1711324800&semt=sph"
              alt="user image"
            />
            <p className="user_name">{loginUserData.name}</p>
          </div>
        </div>
        <div className="profile_bottom">
          <div className="profile_options">
            <ul>
              <li>Posts</li>
              <li>Groups</li>
            </ul>
          </div>
          <div className="profile_posts">
            <div className="profile_posts_left">
              <div className="post_create_group">
                <p>Create group</p>

                <input
                  type="text"
                  className="profile_group_input"
                  placeholder="Add group name"
                  name="name"
                  value={groupDetais.name}
                  onChange={(e) => handleGroupDetails(e)}
                />
                <input
                  type="text"
                  className="profile_group_input"
                  placeholder="Add description"
                  name="description"
                  value={groupDetais.description}
                  onChange={(e) => handleGroupDetails(e)}
                />
                <input
                  type="text"
                  className="profile_group_input"
                  placeholder="Public / Private"
                  name="type"
                  value={groupDetais.type}
                  onChange={(e) => handleGroupDetails(e)}
                />
                <label className="profile_group_input profile_label">
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    placeholder="Select photo"
                    name="photo"
                    onChange={(e) => setSelectPhoto(e.target.files[0])}
                  />
                  <p>Select group photo</p>
                </label>
                <button
                  className="profile_group_btn"
                  type="submit"
                  onClick={() => handleCreateGroup()}
                >
                  Create Group
                </button>
              </div>
              <div className="profile_group_list">
                <p>Group List</p>
                {groupList.length === 0 ? (
                  <h4>Don't have any group</h4>
                ) : (
                  groupList.map((element, index) => {
                    return (
                      <GroupStyle
                        group={element}
                        key={index / 2}
                        fetchGroup={fetchGroups}
                       
                      />
                    );
                  })
                )}
              </div>
            </div>
            <div className="profile_posts_right">
              <div className="profile_post_create">
                <div className="profile_post_inputs">
                  <img
                    src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?size=626&ext=jpg&ga=GA1.1.34264412.1711324800&semt=sph"
                    alt="user image"
                  />
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    onChange={(e) => setCreatePostTitle(e.target.value)}
                  />
                </div>
                <div className="profile_post_docs">
                  <label>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => setCreatePostPhoto(e.target.files[0])}
                    />
                    <i className="fa-solid fa-image"></i>
                  </label>
                  <button onClick={() => handleCreatePost()}>Post</button>
                </div>
              </div>
              {allUserPosts.length === 0 ? (
                <p>You have no post</p>
              ) : (
                allUserPosts.map((element, index) => {
                  return (
                    <>
                      <HomeCont element={element} key={index * 3} />
                    </>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
