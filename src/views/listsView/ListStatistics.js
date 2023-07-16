import React from "react";
const ListStatistics = props => {
    const {listInfo} = props
    const elements = ["likes","dislikes","watchlists"]
    return (<div className="list-statistics-container">
        {elements.map((e) => listInfo[e]>0&&<p><span style = {{"fontWeight": 600,}}>{e+" "}</span>{listInfo[e]+"|"}</p>)}
        <p><span style = {{"fontWeight": 600,}}>{`favs/dislikes: `}</span>{`${listInfo["likes"]}:${listInfo["dislikes"]}`}</p>
    </div>)
}
export default ListStatistics;