import React from "react";
import { updateListInteraction } from "../apiEffects";
const parse = require('html-react-parser');
const ListInteractionButtons = props => {
    const {list_id, userData, navigate, info, setInfo} = props.data
    const list_buttons = [{name:"watchlist",label:"+", function:void(0)},{name:"like", label:"&#128077;", function:void(0)},
                        {name:"dislike", label:"&#128078;", function:void(0)}];
    const listInteraction = (btn) => {
        if (list_id&&userData.user_id) {
            const input = {type:btn.name, list_id:list_id, user_id:userData.user_id,hash:userData.hash,delete:info.list_info[btn.name]&&info.list_info[btn.name]}
            const oldInfo = info
            const newListInfo = {...info.list_info, [btn.name]:!info.list_info[btn.name]}
            updateListInteraction(input).then(() => {
                const toCheck = `${btn.name==="like"?"dislike":"like"}`
                if(["like","dislike"].includes(btn.name)&&info.list_info[toCheck]){
                    updateListInteraction({type:toCheck,list_id:list_id, user_id:userData.user_id, delete:true, hash:userData.hash})
                    setInfo({...oldInfo, ...newListInfo})
                    console.log({...oldInfo, ...newListInfo})
                } else {setInfo({...oldInfo, ...newListInfo})};})}
    }
    return (
    <div className="list-buttons">
        {list_buttons.map((btn) => 
            <button className={`${btn.name}-btn${info.list_info[btn.name]?"-active":""}`} key={btn.name} onClick={userData?() => listInteraction(btn):() => navigate("/login")}>
                {parse(btn.label)}
            </button>)}
    </div>
    )
}
export default ListInteractionButtons;