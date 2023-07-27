import React,{useState} from "react";
import { updateListInteraction } from "../apiEffects";
const parse = require('html-react-parser');
const ListInteractionButtons = props => {
    const {list_id, user_id, userData, navigate} = props
    const {watchlist, like, dislike} = props.original_interactions
    const list_buttons = [{name:"watchlist",label:"+", function:void(0)},{name:"like", label:"&#128077;", function:void(0)},
                        {name:"dislike", label:"&#128078;", function:void(0)}];
    const [interactions, setInteractions] = useState({watchlist, like, dislike})
    const listInteraction = (btn) => {
        if (list_id&&user_id) {
            const input = {type:btn.name, list_id:list_id, user_id:user_id, delete:interactions&&interactions[btn.name]&&interactions[btn.name]}
            updateListInteraction(input).then(() => {
                const toCheck = `${btn.name==="like"?"dislike":"like"}`
                if(["like","dislike"].includes(btn.name)&&interactions[toCheck]){
                    updateListInteraction({type:toCheck,list_id:list_id, user_id:user_id, delete:true, hash:userData.hash})
                    setInteractions({...interactions,[toCheck]:!interactions[toCheck],[btn.name]:!interactions[btn.name]})}
                else {setInteractions({...interactions,[btn.name]:!interactions[btn.name]})}
        })}
    }
    return (
    <div className="list-buttons">
        {list_buttons.map((btn) => 
            <button className={`${btn.name}-btn${interactions&&interactions[btn.name]?"-active":""}`} key={btn.name} onClick={userData?() => listInteraction(btn):() => navigate("/login")}>
                {parse(btn.label)}
            </button>)}
    </div>
    )
}
export default ListInteractionButtons;