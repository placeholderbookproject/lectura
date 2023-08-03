import React from "react";
const ListInteractionsStatistics = props => {
    const {listInfo} = props, {likes, dislikes} = listInfo
    const elements = ["likes","dislikes","watchlists"]
    return (<div className="list-statistics-container">
        {elements.map((e) => listInfo[e]>0&&<p><span>{e+" "}</span>{listInfo[e]+"|"}</p>)}
        {!(likes===0&&dislikes===0)&&<p><span>{`favs/dislikes: `}</span>{`${likes}:${dislikes}`}</p>}
    </div>)
}
export default ListInteractionsStatistics;