import React,{useState,useEffect,useMemo} from "react";
import { useSearchParams } from "react-router-dom";
import Profile from "./Profile";
import UserElementInteractionsList from "./UserElementInteractionsList";
import CheckList from "./CheckList";
import YourLists from "./YourLists";
import YourComments from "./YourComments";
import { setTab } from '../commonFuncs.js';
import { fetchUserData, wikidataEffectProfile } from "../apiEffects";
import AdminView from "./AdminView";

export const extract_q = (list_of_dicts) => {
    const authorQs = [];
    const textQs = [];
    Object.values(list_of_dicts).forEach(list => {
        list.forEach(element => {
            if (element.author_q) authorQs.push(element.author_q);
            if (element.text_q) textQs.push(element.text_q);
        });
    });
    return { author_q: authorQs, text_q: textQs };
};

export const processLists = (data, wiki) => {
    const processedLists = {};
    const textMap = new Map(wiki.texts.map(text => [text.text_q, text]));
    const authorMap = new Map(wiki.authors.map(author => [author.author_q, author]));
    Object.keys(data).forEach(key => {
        processedLists[key] = data[key].map(element => {
            if (element.text_q) {
                const text = textMap.get(element.text_q);
                return text ? { ...element, ...text } : element;
            } else if (element.author_q) {
                const author = authorMap.get(element.author_q);
                return author ? { ...element, ...author } : element;
            }
            return element;
        });
    }); return processedLists;
};

const ProfileView = ({ userData, setUserData, lang }) => {
    const [searchParams,setSearchParams] = useSearchParams();
    const id_type_list = {author_watch:"author_id", watch:"text_id", user_lists_watchlists:"list_id", favorites:"text_id",dislikes:"text_id", list_favorites:"list_id", list_dislikes:"list_id"}
    const defaultTabs = {info:true, watchlist:false, checkedlist:false, commentlist:false, likeslist:false}
    const [tabOpen, setTabOpen] = useState(defaultTabs)
    const [data, setData] = useState({});
    const [wiki, setWiki] = useState({});
    const tabs = useMemo(() => {
        return Object.keys(wiki).length > 0 && [
            { value: "info", tabName: "Profile Info", component: <Profile userData={userData} setUserData={setUserData} /> },
                userData.user_role === 'administrator' && { value: "admin", tabName: 'Admin', component: <AdminView userData={userData} /> },
            { value: "watchlist", tabName: "Watchlists", component: <UserElementInteractionsList userData={userData} data={wiki} id_type_list={id_type_list} lists={[{ label: "Authors", value: "author_watch" }, { label: "Texts", value: "watch" }, { label: "Lists", value: "user_lists_watchlists" }]} /> },
            { value: "checkedlist", tabName: `Checks (${wiki.checks.length})`, component: <CheckList userData={userData} data={wiki.checks} /> },
            { value: "text_interactions", tabName: "Favorites & Dislikes", component: <UserElementInteractionsList userData={userData} data={wiki} id_type_list={id_type_list} lists={[{ label: "Favorites", value: "favorites" }, { label: "Dislikes", value: "dislikes" }]} /> },
            { value: "lists", tabName: `Lists (${wiki.lists.length})`, component: <YourLists userData={userData} data={wiki.lists} /> },
            { value: "list_interactions", tabName: 'List Favorites & Dislikes', component: <UserElementInteractionsList userData={userData} data={wiki} id_type_list={id_type_list} lists={[{ label: "Favorites", value: "list_favorites" }, { label: "Dislikes", value: "list_dislikes" }]} /> },
            { value: "comments", tabName: `Comments (${wiki.comments.length})`, component: <YourComments userData={userData} data={wiki.comments} /> }
        ].filter(Boolean);
    }, [wiki, userData, id_type_list]);    const setNewSearchParams = (tab) => {
        const existingParams = new URLSearchParams(searchParams.toString());
        existingParams.has(tab) ? existingParams.delete(tab) : existingParams.set(tab, true);
        setSearchParams(existingParams);
    };
    useEffect(() => {fetchUserData(userData.user_id, setData)}, [userData.user_id]);
    useEffect(() => {if(Object.keys(data).length>0){
        wikidataEffectProfile({ results: extract_q(data), language: lang.value })()
            .then(wiki => setWiki(processLists(data, wiki)))} // Call processLists with both data and wiki
    },[data,lang])
    useEffect(()=>{
        if (searchParams){
            const searchParamsDictionary = {};
            searchParams.forEach((value, key) => {searchParamsDictionary[key] = value;});
            setTabOpen({...defaultTabs, ...searchParamsDictionary})
        }}, [searchParams])
    return (Object.keys(wiki).length>0&&<div className="profile-dropdown-container">
    {tabs.map((tab) => tab.value&&(
        <div key={tab.tabName} className="profile-option-box">
            <div className={`tab-container${tabOpen[tab.value]?"-open":""}`} onClick = {()=>{setNewSearchParams(tab.value);setTab(tab.value, tabOpen, setTabOpen)}}>{tab.tabName}</div>
            {tabOpen[tab.value]&&tab.component}
        </div>))}
    </div>)
}
export default ProfileView;