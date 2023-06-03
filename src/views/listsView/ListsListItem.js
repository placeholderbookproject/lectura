import React from "react";

const ListsListItem = (props) => {
    const {img, title, description, type, url/*, fav, dis*/} = props
    return (
        <li className="list-item">
            <div className="list-image"><img src={img} /*alt = {description}*//></div>
            <div>
                <h3><a href={`/lists/${type.toLowerCase()}/${url}`}>{title}</a></h3>
                <span className="list-info"><p className="list-image-description">{description}</p></span>
            </div>
        </li>
    )
}
export default ListsListItem;