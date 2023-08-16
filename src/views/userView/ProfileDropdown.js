import React,{useState} from "react";
import {Link} from 'react-router-dom'

const ProfileDropdown = props => {
    const {userData} = props
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleDropdownToggle = () => {setIsDropdownOpen(!isDropdownOpen);};
    const userLabel = `/user/show/${userData.user_id+"_"+userData.user_name}`
    const profileLinks = [{label:"Profile", component:userLabel}
                        ,{label:"Watchlist", component:`${userLabel}/watchlist`}
                        ,{label:"Checks", component:`${userLabel}/checks`}
                    ,{label:"Lists"},{label:"Comments"},{label:"Favorites"}]
    return (
    <div className="dropdown-container">
        <div className="dropdown-trigger" onMouseEnter={handleDropdownToggle} >
        {(userData!==false)
            ?<Link className="header-btn" to={userLabel}><button>{userData.user_name.slice(0,1).toUpperCase()}</button></Link>
            :<Link className="header-btn" to="/login"><button>Login</button></Link>}
        </div>
        {isDropdownOpen && userData!==false &&(
        <div className="dropdown-content">
            {profileLinks.map((link)=><div className="dropdown-item">{link.label}</div>)}
        </div>
        )}
  </div>)
}
export default ProfileDropdown;