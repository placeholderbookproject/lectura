import React, {useState} from "react";
import ListInteractionButtons from "./ListInteractionButtons";
import { useNavigate, Link } from "react-router-dom";
import ListInteractionsStatistics from "./ListInteractionsStatistics";

const ListsListItem = (props) => {
    const {img, list_name, list_description, list_id, list_created, list_modified, user_name, user_deleted,list_deleted, tab} = props.list_data
    const [info, setInfo] = useState({list_info:props.list_data})
    const url = `${(list_id+"_"+list_name)}`
    const navigate = useNavigate();
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const dates = [{label:"Created ", content:list_created}, {label:"Mod. ", content: list_created!==list_modified&&list_modified}]
    return (
    !list_deleted&&
        <div className="list-item">
            <div className="list-image">{img&&<img src={img} alt = {list_description}/>}</div>
            <div className="list-of-list-header">
                <h3 className={`list-title${tab==="official"?"-official":""}`}>
                    <a onClick={()=>navigate(`/lists/${tab}/${url}`)} href={`/lists/${tab}/${url}`}>{`${tab==="official"?"Official: ":""}${list_name}`}</a>
                </h3>
                <p className="list-description">{list_description}</p>
            </div>
            <div className="list-details">
                <ListInteractionsStatistics listInfo={info.list_info}/>
                <div className="list-interactions-container">
                    {(props.userData.userName===user_name||props.userData.user_role==='administrator')&&
                        <Link to={`/lists/${tab}/${list_id}_${list_name}?edit=true`}><button className="edit-btn">&#9998;</button></Link>}
                    <ListInteractionButtons data={{list_id, userData:props.userData, setUserData:props.setUserData, info, setInfo}}/>
                </div>
                {user_name&&<div className={`list-user${user_deleted?'-deleted':''}`}><label>User </label>{user_name}</div>}
                <div className="list-dates">
                    {dates.map(d => d.content&&<><label>{d.label}</label><p className="list-date">{new Date(d.content).toLocaleDateString(undefined, dateOptions)}</p></>)}
                </div>
            </div>
        </div>
    )
}
export default ListsListItem;