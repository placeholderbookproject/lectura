import React from "react";
import { useNavigate } from "react-router-dom";

const ListsListItem = (props) => {
    const {img, list_name, list_description, list_type, url, list_id, list_created, list_modified, user_name/*, fav, dis*/} = props.list_data
    const list_url = `${!url?(list_id+"_"+list_name):url}`
    const navigate = useNavigate();
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    console.log(props.list_data)
    return (
        <div className="list-item">
            <div className="list-image">{img&&<img src={img} alt = {list_description}/>}</div>
            <div className="list-header">
                <h3 className="list-title"><a /*href={`/lists/${list_type.toLowerCase()}/${list_url}`}*/ onClick={()=>navigate(`/lists/${props.tab}/${list_url}`)}>{list_name}</a></h3>
                <p className="list-description">{list_description}</p>
            </div>
            <div className="list-details">
                <div className="list-user">User {user_name}</div>
                <div className="list-dates">
                    {list_created&&<><label>Created </label><p className="list-created">{new Date(list_created).toLocaleDateString(undefined, dateOptions)}</p></>}
                    {list_modified&&list_created!==list_modified&&<><label>Modified </label><p className="list-modified">{new Date(list_modified).toLocaleDateString(undefined, dateOptions)}</p></>}
                </div>
                <div className="list-buttons"></div>
            </div>
        </div>
    )
}
export default ListsListItem;