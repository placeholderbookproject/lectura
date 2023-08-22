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
    const [searchParams,setSearchParams] = useSearchParams();
    const id_type_list = {author_watch:"author_id", watch:"text_id", user_lists_watchlists:"list_id", favorites:"text_id",dislikes:"text_id"}
    const defaultTabs = {info:true, watchlist:false, checkedlist:false, commentlist:false, likeslist:false}
    const [tabOpen, setTabOpen] = useState(defaultTabs)
    const [data, setData] = useState({});
    const tabs = [{value:"info", tabName:"Profile Info",component:<Profile userData={props.userData}/>}
                ,{value:"watchlist", tabName:"Watchlists"
                    , component:<UserElementInteractionsList userData={props.userData} data={data} id_type_list={id_type_list}
                    lists={[{label:"Authors",value:"author_watch"},{label:"Texts", value:"watch"},{label:"Lists", value:"user_lists_watchlists"}]}  />}
                ,{value:"checkedlist", tabName:"Checks", component:<CheckList userData={props.userData} data={data}/>}
                ,{value:"text_interactions", tabName:"Favorites & Dislikes"
                    ,component:<UserElementInteractionsList userData={props.userData} data={data} id_type_list={id_type_list}
                        lists={[{label:"Favorites",value:"favorites"},{label:"Dislikes", value:"dislikes"}]} />}
                ,{value:"lists", tabName:"Lists", component:<YourLists userData={props.userData} data={data.lists}/>}
                ,{value:"comments",tabName:"Comments", component: <YourComments userData={props.userData} data={data.comments}/>}
                /*,{value:"likeslist",tabName:"Favorites"}*/]
    const setNewSearchParams = (tab) => {
        const existingParams = new URLSearchParams(searchParams.toString());
        if (existingParams.get(tab)){existingParams.delete(tab)}
        else (existingParams.set(tab, true))
        setSearchParams(existingParams)
    }
    useEffect(()=>fetchUserData(props.userData.user_id, setData),[])
    useEffect(()=>{
        if (searchParams){
            const searchParamsDictionary = {};
            searchParams.forEach((value, key) => {searchParamsDictionary[key] = value;});
            setTabOpen({...tabOpen, ...searchParamsDictionary})
        }}, [searchParams])
    return (Object.keys(data).length>0&&<div className="dropdowns-container">
    {tabs.map((tab) => (
        <div key={tab.tabName}>
            <div className="tab-container" onClick = {()=>{setNewSearchParams(tab.value);setTab(tab.value, tabOpen, setTabOpen)}}>{tab.tabName}</div>
            {tabOpen[tab.value]&&tab.component}
        </div>))}
    </div>)
}
export default ProfileView;