import React,{useState, useEffect} from "react";
import { fetchListReferences } from "../apiEffects";
const parse = require('html-react-parser');

const ListReference = props => {
    const [showDetails, setShowDetails] = useState(false)
    const {list_id, list_name, list_created, user_name,user_deleted, list_description} = props.data
    const list_url = `/lists/all/${list_id}_${list_name}`
    const buttonContent = showDetails?'&#8593;':'&#8595';
    return (<>
        <div className="list-reference-container"><p>{`#${props.index+1} - `}</p>
            <p className="list-reference-row" key={list_url}><a href={list_url} className="archiveRow">{list_name}</a></p>
            <p className={`list-user${user_deleted?'-deleted':''}`}>{`by ${user_name} (${list_created})`}</p>
            <button className="show-details-btn" onClick={()=>setShowDetails(!showDetails)}>{parse(buttonContent)}</button>
        </div>
        {showDetails&&<div className="list-reference-details"><p>{list_description}</p></div>}
        </>)
}
const ListReferences = ({type, id, userData, tabOpen, setTabOpen}) => {
    const [lists, setLists] = useState([])
    useEffect(() => {fetchListReferences(type, id, setLists).then((res) => 
            {res.length>0?setTabOpen({...tabOpen, ["Lists"]:true}):setTabOpen({...tabOpen, ["Lists"]:false})} )},[type, id])
    return (<>{lists.length>0&&lists.map((list,index) => (!list.private||list.private&&list.user_id===userData.user_id)&& 
                <ListReference data={list} index={index}/>)}</>)
}
export default ListReferences;