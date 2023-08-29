import React,{useState} from "react";
import {Link, useNavigate} from 'react-router-dom'
import Modal from "../Modal";
import LoginView from "../loginView/LoginForm";
import Cookies from "js-cookie";

const ProfileDropdown = props => {
    const {userData, setUserData} = props
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleDropdownToggle = () => {setIsDropdownOpen(!isDropdownOpen);};
    const userLabel = `/user/show/${userData.user_id+"_"+userData.user_name}`
    const profileLinks = [{label:"Profile", component:userLabel},{label:"Watchlist", component:`${userLabel}?watchlist=true`}
                        ,{label:"Checks", component:`${userLabel}?checkedlist=true`},{label:"Favorites & Dislikes", component:`${userLabel}?text_interactions=true`}
                        ,{label:"Your Lists", component:`${userLabel}?lists=true`},{label:"List Favorites & Dislikes", component:`${userLabel}?list_interactions=true`}
                        ,{label:"Comments", component:`${userLabel}?comments=true`}
                        ,userData.user_role==='administrator'&&{label:"Admin", component:`${userLabel}?admin=true`}]
    const logout = () => {setUserData(false);Cookies.remove('user');navigate("/")}
    return (
    <div className="dropdown-container">
        <div className="dropdown-trigger" onClick={handleDropdownToggle}>
        {(userData!==false)
            ?<button className="header-btn">{userData.user_name}</button>
            :<Modal triggerButton={<button className="modal-entry-btn">Login</button>}><LoginView userData={userData} setUserData={setUserData}/></Modal>}
        </div>
        {isDropdownOpen && userData!==false &&(
        <div className="dropdown-content">
            {profileLinks.map((link)=>link.label&&<div className="dropdown-item" key={link.label}><Link to={link.component}>{link.label}</Link></div>)}
            <div className="dropdown-item"><button className="logout-btn" onClick = {() => logout()}>Log Out</button></div>
        </div>
        )}
  </div>)
}
export default ProfileDropdown;