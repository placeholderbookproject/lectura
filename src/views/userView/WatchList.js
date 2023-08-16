import React, {useState, useEffect} from "react";
import {postTextInteraction } from "../apiEffects";

const WatchListElements = props => {
    const [data, setData] = useState(props.data);
    const WatchListAuthorElement = props => {
        const {label, author_birth_country, author_q, author_id} = props.element, {userData, data, setData, type} = props
        const country = author_birth_country ? ` (${author_birth_country})`:''
        const removeElement = () => {
            const updatedData = data[type].filter(item => item.author_id !== author_id);
            setData({...data, [type]:updatedData});
            postTextInteraction({condition: false, user_id: userData.user_id, id:author_id, type, hash:userData.hash});}   
            return (<div className="watchlist-element-container">
                        <p>{`#${props.index+1} `}<a href={`/author/${author_id}`}>{label}</a>{country} <a href={author_q}>(Wiki)</a>
                        <button className="watchlist-btn-active" onClick={()=>removeElement()}>x</button>
                    </p></div>)
    }
    const WatchListTextElement = props => {
        const {label, text_author, text_language, text_q, author_id, text_id} = props.element
        const language = text_language ? ` (${text_language})`:''
        return (<div className="watchlist-element-container">
                    <p>{`#${props.index+1} `}<a href={`/author/${author_id}/text/${text_id}`}>{label}</a>{text_language} <a href={text_q}>(Wiki)</a>
                    {/*<button className="watchlist-btn-active" onClick={()=>removeElement()}>x</button>*/}
                    </p></div>)    
    }
    const element = (e, index) => {
        const translation = {author_watch: <WatchListAuthorElement element={e} data={data} setData={setData} userData={props.userData} index={index} type={props.type}/>,
                        watch: <WatchListTextElement element={e} data={data} setData={setData} userData={props.userData} index={index} type={props.type}/>}
        return translation[props.type]}
        return (<div>{data[props.type].map((e,index) => element(e,index))}</div>)
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