import React,{useState,useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import Profile from "./Profile";
import UserElementInteractionsList from "./UserElementInteractionsList";
import CheckList from "./CheckList";
import YourLists from "./YourLists";
import YourComments from "./YourComments";
import { setTab } from '../commonFuncs.js';
import { fetchUserData } from "../apiEffects";
const ProfileView = props => {
    const {userData, setUserData} = props
    const [searchParams,setSearchParams] = useSearchParams();
    const id_type_list = {author_watch:"author_id", watch:"text_id", user_lists_watchlists:"list_id", favorites:"text_id",dislikes:"text_id", list_favorites:"list_id", list_dislikes:"list_id"}
    const defaultTabs = {info:true, watchlist:false, checkedlist:false, commentlist:false, likeslist:false}
    const [tabOpen, setTabOpen] = useState(defaultTabs)
    const [data, setData] = useState({});
    const tabs = Object.keys(data).length>0&&
                [{value:"info", tabName:"Profile Info",component:<Profile userData={userData} setUserData={setUserData}/>}
                ,{value:"watchlist", tabName:"Watchlists",component:<UserElementInteractionsList userData={userData} data={data} id_type_list={id_type_list}
                        lists={[{label:"Authors",value:"author_watch"},{label:"Texts", value:"watch"},{label:"Lists", value:"user_lists_watchlists"}]}  />}
                ,{value:"checkedlist", tabName:`Checks (${data.checks.length})`, component:<CheckList userData={userData} data={data.checks}/>}
                ,{value:"text_interactions", tabName:"Favorites & Dislikes",component:<UserElementInteractionsList userData={userData} data={data} id_type_list={id_type_list}
                        lists={[{label:"Favorites",value:"favorites"},{label:"Dislikes", value:"dislikes"}]} />}
                ,{value:"lists", tabName:`Lists (${data.lists.length})`, component:<YourLists userData={userData} data={data.lists}/>}
                ,{value:"list_interactions", tabName:'List Favorites & Dislikes', component: <UserElementInteractionsList userData={userData} data={data} id_type_list={id_type_list} 
                    lists={[{label:"Favorites",value:"list_favorites"},{label:"Dislikes", value:"list_dislikes"}]} />}
                ,{value:"comments",tabName:`Comments (${data.comments.length})`, component: <YourComments userData={userData} data={data.comments}/>}
            ,userData.user_role==='administrator'&&{value:"admin",tabName:'Admin'}]
    const setNewSearchParams = (tab) => {
        const existingParams = new URLSearchParams(searchParams.toString());
        if (existingParams.get(tab)){existingParams.delete(tab)} else (existingParams.set(tab, true))
        setSearchParams(existingParams)
    }
    useEffect(()=>fetchUserData(userData.user_id, setData),[])
    useEffect(()=>{
        if (searchParams){
            const searchParamsDictionary = {};
            searchParams.forEach((value, key) => {searchParamsDictionary[key] = value;});
            setTabOpen({...defaultTabs, ...searchParamsDictionary})
        }}, [searchParams])
    return (Object.keys(data).length>0&&<div className="dropdowns-container">
    {tabs.map((tab) => tab.value&&(
        <div key={tab.tabName}>
            <div className="tab-container" onClick = {()=>{setNewSearchParams(tab.value);setTab(tab.value, tabOpen, setTabOpen)}}>{tab.tabName}</div>
            {tabOpen[tab.value]&&tab.component}
        </div>))}
    </div>)
}
export default ProfileView;