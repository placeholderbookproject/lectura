import React,{useState} from "react";
import { updateListInteraction } from "../apiEffects";
const parse = require('html-react-parser');
const ListInteractionButtons = props => {
    const {list_id, userData, navigate, info} = props.data
    const [interactions, setInteractions] = useState(info.list_info);
    const list_buttons = [{name:"watchlist",label:"+", function:void(0)},{name:"like", label:"&#128077;", function:void(0)},
                        {name:"dislike", label:"&#128078;", function:void(0)}];
    const listInteraction = (btn) => {
        if (list_id&&userData.user_id) {
            const input = {type:btn.name, list_id:list_id, user_id:userData.user_id,hash:userData.hash,delete:interactions[btn.name]?interactions[btn.name]:false}
            const oldInteractions = interactions
            const newInteractions = {...oldInteractions, [btn.name]:!oldInteractions[btn.name]}
            updateListInteraction(input).then(() => {
                const toCheck = `${btn.name==="like"?"dislike":"like"}`
                if(["like","dislike"].includes(btn.name)&&interactions[toCheck]){
                    updateListInteraction({type:toCheck,list_id:list_id, user_id:userData.user_id, delete:true, hash:userData.hash})
                    const inverse = btn.name==="like"?"dislike":"like"
                    setInteractions({...newInteractions, [inverse]:!oldInteractions[inverse]})
                } else {setInteractions(newInteractions)};})}
    }
    return (
    <div className="list-buttons">
        {list_buttons.map((btn) => 
            <button className={`${btn.name}-btn${interactions[btn.name]?"-active":""}`} key={btn.name} onClick={userData?() => listInteraction(btn):() => navigate("/login")}>
                {parse(btn.label)}
            </button>)}
    </div>
    )
}
export default ListInteractionButtons;