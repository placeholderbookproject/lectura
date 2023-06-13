import React from "react";

const ListsListItem = (props) => {
    const {img, list_name, list_description, list_type, url, list_id/*, fav, dis*/} = props.list_data
    const list_url = `${!url?(list_id+"_"+list_name):url}`
    return (
        <li className="list-item">
            <div className="list-image"><img src={img} /*alt = {description}*//></div>
            <div>
                <h3><a href={`/lists/${list_type.toLowerCase()}/${list_url}`}>{list_name}</a></h3>
                <span className="list-info"><p className="list-image-description">{list_description}</p></span>
            </div>
        </li>
    )
}
export default ListsListItem;