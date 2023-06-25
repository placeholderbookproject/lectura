import React from "react";
import { useNavigate } from "react-router-dom";
import TableRow from "../ViewRow";

const Profile = (props) => {
    const profileInfo = [{label:"User Name ", value: props.userData.user_name}, {label: "Email ", value:props.userData.user_email}]
    const navigate = useNavigate();
    const logout = () => {props.setUserData(false);navigate("/");}
    return (
        <div className="profile-container">
            {profileInfo.map((info) => <TableRow label={info.label} key={info.value}>{info.value}</TableRow>)}
            <button onClick = {() => logout()}>Log Out</button>
        </div>
    )
}

export default Profile;