import React, {useState, useEffect} from "react";
import {postTextInteraction, updateListInteraction } from "../apiEffects";
import UserElementSearch from "./UserElementSearch";

const element = (e, index, data, setData, type) => {
    switch (type) {case 'author_watch':return <WatchListAuthorElement element={e} data={data} setData={setData} index={index} />;
                case 'watch': case 'favorites': case 'dislikes': return <WatchListTextElement element={e} data={data} setData={setData} index={index} />;
            case 'user_lists_watchlists': case 'list_favorites': case 'list_dislikes': return <WatchListListElement element={e} data={data} setData={setData} index={index} />;
        default: return null; // Handle unsupported types or provide a default component
    }};  

export const WatchListTextElement = props => {
    const {label, text_language, text_q, author_id, text_id} = props.element
    const language = text_language ? ` (${text_language})`:''
    return (<p>{`#${props.index+1} `}<a href={`/author/${author_id}/text/${text_id}`}>{label}</a>{language} <a href={text_q}>(Wiki)</a></p>)    
}
const WatchListAuthorElement = props => {
    const {label, author_birth_country, author_q, author_id} = props.element
    const country = author_birth_country ? ` (${author_birth_country})`:''
    return (<p>{`#${props.index+1} `}<a href={`/author/${author_id}`}>{label}</a>{country} <a href={author_q}>(Wiki)</a></p>)
}
export const WatchListListElement = props => {
    const {list_name, user_name, list_type, list_created, list_id} = props.element
    return (<p>{`#${props.index+1} `}<a href={`/lists/all/${list_id}_${list_name}`}>{list_name}</a>{` by ${user_name} (${list_type}) (${list_created})`}</p>)
}
const UserElementInteractions = props => {
    const {userData, type, id_type_list} = props;
    const [data, setData] = useState(props.data[type])
    const removeElement = (id,id_type) => {
        const updatedData = data.filter(item => item[id_type] !== id);
        setData({...updatedData});
        if (type==="user_lists_watchlists") {updateListInteraction({type:"watchlist", list_id:id, user_id:userData.user_id,hash:userData.hash,delete:true})}
        else if (type==="list_favorites") {updateListInteraction({type:"like", list_id:id, user_id:userData.user_id, hash:userData.hash, delete:true})}
        else if (type==="list_dislikes") {updateListInteraction({type:"dislike", list_id:id, user_id:userData.user_id, hash:userData.hash, delete:true})}
        else {postTextInteraction({condition: false, user_id: userData.user_id, id, type, hash:userData.hash});}}   
    useEffect(()=>setData(props.data[type]),[type,props.data])
    return (data&&data.length>0&&<div>
            {data.length>3&&<UserElementSearch originData={props.data[type]} setData={setData} searchColumn={"label"}/>}
            {data.map((e,index) => <div className="watchlist-element-container" key={e[id_type_list[type]]}>
                    {element(e,index, data, setData, type)}
                    <button className="watchlist-btn-active" onClick={()=>removeElement(e[id_type_list[type]],id_type_list[type])}>x</button>
                </div>)}
            </div>)
}

const UserElementInteractionsList = props => {
    const {userData, id_type_list, lists} = props
    const [data, setData] = useState(props.data)
    const [tabOpen, setTabOpen] = useState(lists[0]);
    useEffect(()=>{props.data&&setData(props.data)},[props.data])
    return (<div>
        <div className="header-container">{lists.map((l) => 
            <button key={l.label} className={`profile-header-btn${l.label===tabOpen.label?"-active":""}`} onClick={()=>setTabOpen(l)}>
                {`${l.label} (${props.data[l.value].length})`}</button>)}</div>
        <UserElementInteractions data={data} userData={userData} type={tabOpen.value} id_type_list={id_type_list}/>
    </div>)
}
export default UserElementInteractionsList;