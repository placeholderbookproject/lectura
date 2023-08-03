import React from "react";
import ListInteractionButtons from "./ListInteractionButtons";
import { updateUserList } from '../apiEffects';
import ListInteractionsStatistics from "./ListInteractionsStatistics";

const ListHeader = props => {
    const {edit, setEdit,editable, listInfo, userData, changes,setChanges, info, setInfo, list_id, navigate, setSearchParams} = props.data
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
            updateUserList(changes).then(() => {setEdit(!edit);setSearchParams({edit:!edit})}).catch((error) => console.log(error));
            setChanges({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[]})}}
    const deleteList = () => {updateUserList({...changes, delete:true}).then(()=>navigate("/lists"))}
    return (
    <div className="list-header">
        {<h2>{!(editable&&edit)?listInfo.list_name:<input type="text" value={listInfo.list_name} name="list_name" onChange={(e)=>changeInfo(e)}/>}
            {editable&&<>
                <button onClick={()=>{setEdit(!edit);setSearchParams({edit:!edit})}} className="edit-btn">&#9998;</button>
                <button className="delete-btn" onClick={()=>deleteList()}>Delete List</button>
                <button className="save-btn" onClick={()=>saveChanges()}>Save Changes</button></>}
        </h2>}
        <div className="list-details-statistics">
            {listInfo&&<ListInteractionsStatistics listInfo={{likes:listInfo.likes, dislikes:listInfo.dislikes, watchlists:listInfo.watchlists}}/>}
            {userData&&<ListInteractionButtons data = {{list_id, userData, navigate, info, setInfo}}/>}
        </div>
        <div className="list-description">
            {listInfo&&listInfo.list_created&&<p className="list-base-description">{`A personal list of ${listInfo.list_type} created by ${listInfo.user_name} on ${new Date(listInfo.list_created).toLocaleDateString(undefined, dateOptions)} 
                ${listInfo.list_modified!==listInfo.list_created?` (last modified on ${new Date(listInfo.list_modified).toLocaleDateString(undefined, dateOptions)})`:""}`}</p>}
            {!(editable&&edit)
                ?<p className="list-detailed-description">{listInfo.list_description}</p>
                :<textarea className="list-text-area" name="list_description" value={listInfo.list_description} onChange={(e)=>changeInfo(e)}/>}
        </div>
    </div>
    )
}
export default ListHeader;