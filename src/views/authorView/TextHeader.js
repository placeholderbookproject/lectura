import React,{useState, useEffect} from "react";
import ElementInteraction from "../ElementInteraction";
import DeleteData from "./DeleteData";
import { checkData } from "../formattingFuncs";
import { postTextInteraction } from "../apiEffects";
const TextHeader = props => {
    const {text, userData} = props.properties
    const [data, setData] = useState({})
    useEffect(()=>{setData(text)},[text])
    const elementInteractions = [{name:"checks", conditional:{true:"",false:""}, button_name:{true:"check-btn", false:"check-btn"}, label:"Check"},
                {name:"watch", conditional:{true:"+",false:"+"}, button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, label:"Watchlist"}]
    return (text&&
    <h2 className = "Header">{checkData(text.bookLabel,(text.text_title?text.text_title.split(","):"")[0])} <a href={text.text_q}>(Wiki)</a>
        {Object.keys(text).length>0 && elementInteractions.map((e) =>
                <ElementInteraction values={{...e, condition:data[e.name], user_id:userData.user_id, hash:userData.hash,id:text.text_id, postFunction:postTextInteraction}}/>)}
        {userData&&<DeleteData properties={{type:"text", data, setData, userData}}/>}    
    </h2>)
}
export default TextHeader