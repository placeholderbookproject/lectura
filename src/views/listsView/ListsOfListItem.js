import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { updateListInteraction } from "../apiEffects";
const parse = require('html-react-parser');

const ListsListItem = (props) => {
    const {img, list_name, list_description, list_id, list_created, list_modified, user_name, watchlist, like, dislike/*, fav, dis*/} = props.list_data
    const {searchResults, setSearchResults} = props
    const {user_id} = props.userData
    const [interactions, setInteractions] = useState({watchlist:watchlist, like:like, dislike:dislike})
    const list_buttons = [{name:"watchlist",label:"+", function:void(0)},{name:"like", label:"&#128077;", function:void(0)},
                            {name:"dislike", label:"&#128078;", function:void(0)}]
    const url = `${(list_id+"_"+list_name)}`
    const navigate = useNavigate();
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const listInteraction = (btn) => {
        if (list_id&&user_id) {
            const input = {type:btn.name, list_id:list_id, user_id:user_id, delete:interactions&&interactions[btn.name]&&interactions[btn.name]}
            updateListInteraction(input).then(() => {
                const toCheck = `${btn.name==="like"?"dislike":"like"}`
                if(["like","dislike"].includes(btn.name)&&interactions[toCheck]){
                    updateListInteraction({type:toCheck,list_id:list_id, user_id:user_id, delete:true})
                    setInteractions({...interactions,[toCheck]:!interactions[toCheck],[btn.name]:!interactions[btn.name]})}
                else {setInteractions({...interactions,[btn.name]:!interactions[btn.name]})}
        })
    }}
    return (
        <div className="list-item">
            <div className="list-image">{img&&<img src={img} alt = {list_description}/>}</div>
            <div className="list-header">
                <h3 className="list-title"><a onClick={()=>navigate(`/lists/${props.tab}/${url}`)}>{list_name}</a></h3>
                <p className="list-description">{list_description}</p>
            </div>
            <div className="list-details">
                <div className="list-buttons">
                    {list_buttons.map((btn) => 
                        <button className={`${btn.name}-btn${interactions&&interactions[btn.name]?"-active":""}`} key={btn.name} onClick={props.userData?() => listInteraction(btn):() => navigate("/login")}>
                            {parse(btn.label)}
                        </button>)}
                </div>
                {user_name&&<div className="list-user"><label>User </label>{user_name}</div>}
                <div className="list-dates">
                    {list_created&&<><label>Created </label><p className="list-created">{new Date(list_created).toLocaleDateString(undefined, dateOptions)}</p></>}
                    {list_modified&&list_created!==list_modified&&<>
                        <label>Modified </label><p className="list-modified">{new Date(list_modified).toLocaleDateString(undefined, dateOptions)}</p></>}
                </div>
            </div>
        </div>
    )
}
export default ListsListItem;