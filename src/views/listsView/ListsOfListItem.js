import React from "react";
import ListInteractionButtons from "./ListInteractionButtons";
import { useNavigate } from "react-router-dom";

const ListsListItem = (props) => {
    const {img, list_name, list_description, list_id, list_created, list_modified, user_name, watchlist, like, dislike, list_deleted/*, fav, dis*/} = props.list_data
    const {searchResults, setSearchResults} = props
    const {user_id} = props.userData
    const url = `${(list_id+"_"+list_name)}`
    const navigate = useNavigate();
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    return (
    !list_deleted&&
        <div className="list-item">
            <div className="list-image">{img&&<img src={img} alt = {list_description}/>}</div>
            <div className="list-header">
                <h3 className="list-title"><a onClick={()=>navigate(`/lists/${props.tab}/${url}`)}>{list_name}</a></h3>
                <p className="list-description">{list_description}</p>
            </div>
            <div className="list-details">
                <ListInteractionButtons list_id={list_id} user_id={user_id} userData={props.userData} navigate={navigate} original_interactions={{watchlist, like, dislike}}/>
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