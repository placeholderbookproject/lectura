import React,{useState,useEffect} from "react";
import Profile from "./Profile";
import WatchList from "./WatchList";
import { setTab } from '../commonFuncs.js';
import { fetchUserData } from "../apiEffects";
const ProfileView = props => {
    const defaultTabs = {info:true, watchlist:false, checkedlist:false, commentlist:false, likeslist:false}
    const [tabOpen, setTabOpen] = useState(defaultTabs)
    const [data, setData] = useState({});
    const tabs = [{value:"info", tabName:"Profile Info",component:<Profile userData={props.userData}/>}
                ,{value:"watchlist", tabName:"Watchlist", component:<WatchList userData={props.userData} data={data}/>}
                ,{value:"checkedlist", tabName:"Checks"}
                ,{value:"commentlist",tabName:"Comments"}
                ,{value:"likeslist",tabName:"Favorites"}]
    useEffect(()=>fetchUserData(props.userData.user_id, setData),[])
    return (<div className="dropdowns-container">
    {tabs.map((tab) => (
        <div key={tab.tabName}>
            <div className="tab-container"><div className={`tab-button${tabOpen[tab.value]?'':"-inactive"}`} 
                onClick = {()=>{setTab(tab.value, tabOpen, setTabOpen)}}>{tab.tabName}</div></div>
            {tabOpen[tab.value]&&tab.component}
        </div>))}
    </div>)
}
export default ProfileView;