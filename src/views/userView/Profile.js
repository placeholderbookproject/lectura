import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import TableRow from "../ViewRow";
import DeleteUser from "./DeleteUser";
import Cookies from "js-cookie";
import EditProfile from "./EditProfile";

const Profile = (props) => {
    const profileInfo = [{label:"User Name ", value: props.userData.user_name}, {label: "Email ", value:props.userData.user_email}]
    const navigate = useNavigate();
    const [deleteUser, setDeleteUser] = useState(false);
    const [edit, setEdit] = useState(false)
    const [editType, setEditType] = useState("user_password")
    const logout = () => {props.setUserData(false);Cookies.remove('user');navigate("/");}
    return (
        <div className="profile-container">
            {(!deleteUser&&!edit)
                ?<>{profileInfo.map((info) => 
                    <div className="profile-row-container"><TableRow label={info.label} key={info.value}>{info.value}</TableRow>
                        {info.label==="User Name "&&<button className="return-btn" onClick={()=>{setEdit(!edit);setEditType("user_name")}}>&#x270E;</button>}</div>)}
                <button className="logout-btn" onClick = {() => logout()}>Log Out</button>
                <button className="edit-profile-btn" onClick={() => {setEdit(!edit);setEditType("user_password")}}>Change Password</button>
                <button className="delete-user-btn" onClick={() => setDeleteUser(true)}>Delete User</button>
                </>
            :!edit&&<DeleteUser userData={props.userData} setUserData={props.setUserData} setDeleteUser={setDeleteUser}/>}
            {edit&&<EditProfile properties={{userData:props.userData, edit, setEdit, editType}}/>}
        </div>
    )
}

export default Profile;