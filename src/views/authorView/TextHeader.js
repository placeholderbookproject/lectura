import React,{useState, useEffect} from "react";
import ElementInteraction from "../ElementInteraction";
import DeleteData from "./DeleteData";
import { checkData } from "../formattingFuncs";
import { postTextInteraction, fetchUserElements } from "../apiEffects";
import { elementInteractions } from "./dataRows";
import ListAdd from "./ListAdd";
import Interactions from "../Interactions";

const TextHeader = props => {
    const {text, userData, setUserData} = props.properties
    const [data, setData] = useState({})
    const [interactions, setInteractions] = useState({});
    const [showInteract, setShowInteract] = useState({});
    useEffect(()=>{setData(props.properties.text);fetchUserElements('text',text.text_id, false, setInteractions)},[props.properties.text])
    const likes = interactions["favorites"]
    const dislikes = interactions["dislikes"]
    return (data&&Object.keys(data).length>0&&
    <h2 className = "Header">{checkData(data.bookLabel,(data.text_title?data.text_title.split(","):"")[0])} <a href={`${data.article?data.article:data.text_q}`}>(Wiki)</a>
        {text&&<ListAdd list_type="texts" type_id={text.text_id} userData={userData} setUserData={setUserData} watch={data.watch}/>}
        {elementInteractions.map((e) =>
                e.name!=="watch"&&
                    <>{interactions[e.name]>0&&<button className="interaction-btn" onClick={()=>{setShowInteract({type:e.name, id:text.text_id})}}>{interactions[e.name]}</button>}
                    <ElementInteraction values={{...e, condition:data[e.name], user_id:userData.user_id, hash:userData.hash,id:data.text_id,userData,setUserData, postFunction:postTextInteraction}}/></>)}
        {Object.keys(showInteract).length>0&&<Interactions showInteract={showInteract} setShowInteract={setShowInteract}/>}
        {!(likes===0&&dislikes===0)&&<p className="fav-dislike-ratio">{`${likes}:${dislikes}`}</p>}
        {userData&&userData.user_role==='administrator'&&<DeleteData properties={{type:"text", data, setData, userData}}/>}
    </h2>)
}
export default TextHeader