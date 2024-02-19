import React,{useState, useEffect} from "react";
import ElementInteraction from "../ElementInteraction";
import DeleteData from "./DeleteData";
import { checkData } from "../formattingFuncs";
import { postTextInteraction } from "../apiEffects";
import { elementInteractions } from "./dataRows";
const TextHeader = props => {
    const {text, userData, setUserData} = props.properties
    const [data, setData] = useState({})
    useEffect(()=>{setData(text)},[text])
    return (data&&Object.keys(data).length>0&&
    <h2 className = "Header">{checkData(data.bookLabel,(data.text_title?data.text_title.split(","):"")[0])} <a href={`${data.article?data.article:data.text_q}`}>(Wiki)</a>
        {elementInteractions.map((e) =>
                <ElementInteraction values={{...e, condition:data[e.name], user_id:userData.user_id, hash:userData.hash,id:data.text_id,userData,setUserData, postFunction:postTextInteraction}}/>)}
        {userData&&userData.user_role==='administrator'&&<DeleteData properties={{type:"text", data, setData, userData}}/>}    
    </h2>)
}
export default TextHeader