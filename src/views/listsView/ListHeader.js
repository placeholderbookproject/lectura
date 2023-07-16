import React from "react";
import ListInteractionButtons from "./ListInteractionButtons";
import { updateUserList } from '../apiEffects';
import ListStatistics from "./ListStatistics";

const ListHeader = props => {
    const {edit, setEdit, listInfo, userData, changes,setChanges, info, setInfo, list_id, navigate} = props.data
    const listInteractions = info&&{watchlist:info.list_info.watchlist, like:info.list_info.like, dislike:info.list_info.dislike};
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const changeInfo = (event) => {
        setInfo(prevInfo => {
                let updatedInfo = { ...prevInfo };
                updatedInfo.list_info[event.target.name] = event.target.value
                return updatedInfo;})
        const oldChanges = changes;
        setChanges({...oldChanges, list_info:{...oldChanges.list_info, [event.target.name]:event.target.value}})
    }
    const saveChanges = () => {
        if(changes.additions.length>0||changes.removals.length>0||Object.keys(changes.list_info).length>1||changes.order_changes.length>0){
            updateUserList(changes).then(() => setEdit(!edit)).catch((error) => console.log(error));
            setChanges({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[]})}}
    const deleteList = () => {updateUserList({...changes, delete:true}).then(()=>navigate("/lists"))}
    return (
    <div className="list-header">
        {<h2>{!edit?listInfo.list_name:<input type="text" value={listInfo.list_name} name="list_name" onChange={(e)=>changeInfo(e)}/>}
            {listInfo.user_id&&userData.user_id===listInfo.user_id&&<>
                <button onClick={()=>setEdit(!edit)} className="edit-btn">&#9998;</button>
                <button className="delete-btn" onClick={()=>deleteList()}>Delete List</button>
        {edit&&<button className="save-btn" onClick={()=>saveChanges()}>Save Changes</button>}</>}
        </h2>}
        <div className="list-details-statistics">
            {listInfo&&<ListStatistics listInfo={listInfo}/>}
            {userData&&<ListInteractionButtons list_id={list_id} user_id={userData.user_id} userData={userData} navigate={navigate} original_interactions={listInteractions}/>}
        </div>
        <div className="list-description">
            {listInfo&&listInfo.list_created&&<p className="list-base-description">{`A personal list of ${listInfo.list_type} created by ${listInfo.user_name} on ${new Date(listInfo.list_created).toLocaleDateString(undefined, dateOptions)} 
                ${listInfo.list_modified!==listInfo.list_created?` (last modified on ${new Date(listInfo.list_modified).toLocaleDateString(undefined, dateOptions)})`:""}`}</p>}
            {!edit
                ?<p>{listInfo.list_description}</p>
                :<textarea className="list-text-area" name="list_description" value={listInfo.list_description} onChange={(e)=>changeInfo(e)}/>}
        </div>
    </div>
    )
}
export default ListHeader;