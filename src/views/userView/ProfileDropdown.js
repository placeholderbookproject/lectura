import React,{useState} from "react";
import {Link} from 'react-router-dom'
import Modal from "../Modal";
import LoginView from "../loginView/LoginForm";
import Cookies from "js-cookie";

const ProfileDropdown = props => {
    const {userData, setUserData} = props
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleDropdownToggle = () => {setIsDropdownOpen(!isDropdownOpen);};
    const userLabel = `/user/show/${userData.user_id+"_"+userData.user_name}`
    const profileLinks = [{label:"Profile", component:userLabel},{label:"Watchlist", component:`${userLabel}?watchlist=true`}
                        ,{label:"Checks", component:`${userLabel}?checkedlist=true`},{label:"Favorites & Dislikes", component:`${userLabel}?text_interactions=true`}
                        ,{label:"Lists", component:`${userLabel}?lists=true`},{label:"Comments", component:`${userLabel}?comments=true`}]
    const logout = () => {setUserData(false);Cookies.remove('user');}
    return (
    <div className="dropdown-container">
        <div className="dropdown-trigger" onMouseEnter={handleDropdownToggle} >
        {(userData!==false)
            ?<Link className="header-btn" to={userLabel}><button>{userData.user_name.slice(0,1).toUpperCase()}</button></Link>
            :<Modal label="Login"><LoginView userData={userData} setUserData={setUserData}/></Modal>}
        </div>
        {isDropdownOpen && userData!==false &&(
        <div className="dropdown-content">
            {profileLinks.map((link)=><div className="dropdown-item" key={link.label}><Link to={link.component}>{link.label}</Link></div>)}
            <div className="dropdown-item"><button className="logout-btn" onClick = {() => logout()}>Log Out</button></div>
        </div>
        )}
  </div>)
}
export default ProfileDropdown;