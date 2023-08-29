import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import TableRow from "../ViewRow";
import DeleteUser from "./DeleteUser";
import Cookies from "js-cookie";

const Profile = (props) => {
    const profileInfo = [{label:"User Name ", value: props.userData.user_name}, {label: "Email ", value:props.userData.user_email}]
    const navigate = useNavigate();
    const [deleteUser, setDeleteUser] = useState(false);
    const logout = () => {props.setUserData(false);Cookies.remove('user');navigate("/");}
    return (
        <div className="profile-container">
            {!deleteUser
                ?<>{profileInfo.map((info) => <TableRow label={info.label} key={info.value}>{info.value}</TableRow>)}
                <button className="logout-btn" onClick = {() => logout()}>Log Out</button>
                <button className="delete-user-btn" onClick={() => setDeleteUser(true)}>Delete User</button></>
            :<DeleteUser userData={props.userData} setUserData={props.setUserData} setDeleteUser={setDeleteUser}/>}
        </div>
    )
}

export default Profile;