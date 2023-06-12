import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
    const navigate = useNavigate();
    const logout = () => {props.setUserData(false);navigate("/");}
    return (
        <div className="profile-container">
            <p className="profile-info">{props.userData.user_name}</p>
            <button onClick = {() => logout()}>Log Out</button>
        </div>
    )
}

export default Profile;