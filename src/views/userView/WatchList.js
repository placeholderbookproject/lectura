import React, {useState, useEffect} from "react";
import {postTextInteraction } from "../apiEffects";

export const WatchListTextElement = props => {
    const {label, text_language, text_q, author_id, text_id} = props.element
    const language = text_language ? ` (${text_language})`:''
    return (<p>{`#${props.index+1} `}<a href={`/author/${author_id}/text/${text_id}`}>{label}</a>{language} <a href={text_q}>(Wiki)</a></p>)    
}
const WatchListElements = props => {
    const [data, setData] = useState(props.data), {userData, type} = props;
    const removeElement = (id) => {
        const id_type = type==="author_watch"?"author_id":"text_id"
        const updatedData = data[type].filter(item => item[id_type] !== id);
        setData({...data, [type]:updatedData});
        postTextInteraction({condition: false, user_id: userData.user_id, id, type, hash:userData.hash});}   
    const WatchListAuthorElement = props => {
        const {label, author_birth_country, author_q, author_id} = props.element
        const country = author_birth_country ? ` (${author_birth_country})`:''
        return (<p>{`#${props.index+1} `}<a href={`/author/${author_id}`}>{label}</a>{country} <a href={author_q}>(Wiki)</a></p>)
    }
    const element = (e, index) => {
            const translation = {author_watch: <WatchListAuthorElement element={e} data={data} setData={setData} userData={props.userData} index={index}/>,
                        watch: <WatchListTextElement element={e} data={data} setData={setData} userData={props.userData} index={index}/>}
            return translation[props.type]
    }
    return (<div>{data[props.type].map((e,index) => 
                <div className="watchlist-element-container">
                    {element(e,index)}
                    <button className="watchlist-btn-active" onClick={()=>removeElement(props.type==="author_watch"?e.author_id:e.text_id)}>x</button>
                </div>)}
            </div>)
}

const WatchList = props => {
    const {userData} = props
    const [data, setData] = useState(props.data)
    const [tabOpen, setTabOpen] = useState({label:"Authors", value:"author_watch"});
    const lists = [{label:"Authors",value:"author_watch"},{label:"Texts", value:"watch"}]
    useEffect(()=>{props.data&&setData(props.data)},[props.data])
    return (<div>
        <div className="header-container">{lists.map((l) => <button className={`profile-header-btn${l.label===tabOpen.label?"-active":""}`} onClick={()=>setTabOpen(l)}>{l.label}</button>)}</div>
        <WatchListElements data={data} userData={userData} type={tabOpen.value}/>
    </div>)
}
export default WatchList;