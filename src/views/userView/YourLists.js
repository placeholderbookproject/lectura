import React from "react";
import { WatchListListElement } from "./UserElementInteractionsList";
const YourLists = ({data}) => {
    return (data&&<div className="header-container">{data.map((e,index) => <WatchListListElement element={e} index={index}/>)}</div>)
}
export default YourLists;