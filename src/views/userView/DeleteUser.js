import React, {useState} from "react";
import { loginUser, deleteUser } from "../apiEffects";
import { useNavigate } from "react-router-dom";
const bcrypt = require("bcryptjs");

const DeleteUser = ({userData, setUserData, setDeleteUser}) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser({user:userData.user_name})
        .then((result) => {return bcrypt.compare(password, result.pw)})
        .then((response) => {if(response===true){deleteUser(userData);setUserData(false);navigate("/")} else{setError(true)}})
    }
    return (
        <div>
            <p>Are you sure you want to delete your account? Please re-enter your password to confirm.</p>
            <input type="password" value={password} onChange = {(e) => setPassword(e.target.value)}/>
            <button type="submit" className="submit-btn" onClick = {handleSubmit}>Delete Account</button>
            <p>Do not want to delete your account? Go back <button onClick={() => setDeleteUser(false)}>here</button></p>
            {error&&<p>Entered password is incorrect.</p>}
        </div>
    )
}
export default DeleteUser