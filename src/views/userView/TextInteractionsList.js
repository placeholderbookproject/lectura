import React,{useState, useEffect} from "react";
import { WatchListTextElement } from "./WatchList";
import { postTextInteraction } from "../apiEffects";

const TextInteractionElements = props => {
    const [data, setData] = useState(props.data), {userData, type} = props;
    const removeElement = (id) => {
        const id_type = "text_id"
        const updatedData = data[type].filter(item => item[id_type] !== id);
        setData({...data, [type]:updatedData});
        postTextInteraction({condition: false, user_id: userData.user_id, id, type, hash:userData.hash});}   
    const element = (e, index) => {
            const translation = {
                        favorites: <WatchListTextElement element={e} data={data} setData={setData}  index={index}/>
                        ,dislikes: <WatchListTextElement element={e} data={data} setData={setData}  index={index}/>
                    }
            return translation[props.type]
    }
    return (<div>{data[props.type].map((e,index) => 
                <div className="watchlist-element-container" key={e["text_id"]}>
                    {element(e,index)}
                    <button className="watchlist-btn-active" onClick={()=>removeElement(e["text_id"])}>x</button>
                </div>)}
            </div>)
}
const TextInteractionsList = props => {
    const {userData} = props
    const [data, setData] = useState(props.data)
    const [tabOpen, setTabOpen] = useState({label:"Favorites", value:"favorites"});
    const lists = [{label:"Favorites",value:"favorites"},{label:"Dislikes", value:"dislikes"}]
    useEffect(()=>{props.data&&setData(props.data)},[props.data])
    return (<div>
        <div className="header-container">{lists.map((l) => <button key={l.label} className={`profile-header-btn${l.label===tabOpen.label?"-active":""}`} onClick={()=>setTabOpen(l)}>{l.label}</button>)}</div>
        <TextInteractionElements data={data} userData={userData} type={tabOpen.value}/>
    </div>)
}
export default TextInteractionsList;