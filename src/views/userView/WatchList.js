import React, {useState, useEffect} from "react";
import {postTextInteraction, updateListInteraction } from "../apiEffects";

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
const WatchListListElement = props => {
    const {list_name, user_name, list_type, list_created, list_id} = props.element
    return (<p>{`#${props.index+1} `}<a href={`/lists/all/${list_id}_${list_name}`}>{list_name}</a>{` by ${user_name} (${list_type}) (${list_created})`}</p>)
}
const WatchListElements = props => {
    const [data, setData] = useState(props.data), {userData, type} = props;
    const id_type_list = {author_watch:"author_id", watch:"text_id", user_lists_watchlists:"list_id"}
    const removeElement = (id) => {
        const id_type = id_type_list[type]
        const updatedData = data[type].filter(item => item[id_type] !== id);
        setData({...data, [type]:updatedData});
        if (type==="user_lists_watchlists") {updateListInteraction({type:"watchlist", list_id:id, user_id:userData.user_id,hash:userData.hash,delete:true})}
        else {postTextInteraction({condition: false, user_id: userData.user_id, id, type, hash:userData.hash});}}   
    const element = (e, index) => {
            const translation = {author_watch: <WatchListAuthorElement element={e} data={data} setData={setData} index={index}/>
                        ,watch: <WatchListTextElement element={e} data={data} setData={setData}  index={index}/>
                        ,user_lists_watchlists:<WatchListListElement element={e} data={data} setData={setData} index={index}/>}
            return translation[props.type]
    }
    return (<div>{data[props.type].map((e,index) => 
                <div className="watchlist-element-container">
                    {element(e,index)}
                    <button className="watchlist-btn-active" onClick={()=>removeElement(e[id_type_list[type]])}>x</button>
                </div>)}
            </div>)
}

const WatchList = props => {
    const {userData} = props
    const [data, setData] = useState(props.data)
    const [tabOpen, setTabOpen] = useState({label:"Authors", value:"author_watch"});
    const lists = [{label:"Authors",value:"author_watch"},{label:"Texts", value:"watch"},{label:"Lists", value:"user_lists_watchlists"}]
    useEffect(()=>{props.data&&setData(props.data)},[props.data])
    return (<div>
        <div className="header-container">{lists.map((l) => <button className={`profile-header-btn${l.label===tabOpen.label?"-active":""}`} onClick={()=>setTabOpen(l)}>{l.label}</button>)}</div>
        <WatchListElements data={data} userData={userData} type={tabOpen.value}/>
    </div>)
}
export default WatchList;