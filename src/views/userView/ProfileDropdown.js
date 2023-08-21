import React,{useState} from "react";
import {Link} from 'react-router-dom'

const ProfileDropdown = props => {
    const {userData} = props
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleDropdownToggle = () => {setIsDropdownOpen(!isDropdownOpen);};
    const userLabel = `/user/show/${userData.user_id+"_"+userData.user_name}`
    const profileLinks = [{label:"Profile", component:userLabel},{label:"Watchlist", component:`${userLabel}?watchlist=true`}
                        ,{label:"Checks", component:`${userLabel}?checkedlist=true`},{label:"Favorites & Dislikes", component:`${userLabel}?text_interactions=true`}
                        ,{label:"Lists", component:`${userLabel}?lists=true`},{label:"Comments", component:`${userLabel}?comments=true`}]
    return (
    <div className="dropdown-container">
        <div className="dropdown-trigger" onMouseEnter={handleDropdownToggle} >
        {(userData!==false)
            ?<Link className="header-btn" to={userLabel}><button>{userData.user_name.slice(0,1).toUpperCase()}</button></Link>
            :<Link className="header-btn" to="/login"><button>Login</button></Link>}
        </div>
        {isDropdownOpen && userData!==false &&(
        <div className="dropdown-content">
            {profileLinks.map((link)=><div className="dropdown-item" key={link.label}><Link to={link.component}>{link.label}</Link></div>)}
        </div>
        )}
  </div>)
}
export default ProfileDropdown;