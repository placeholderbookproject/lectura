import React from "react";
import { WatchListListElement } from "./UserElementInteractionsList";
const YourLists = props => {
    return (props.data&&<div className="header-container">{props.data.map((e,index) => <WatchListListElement element={e} index={index}/>)}</div>)
}
export default YourLists;