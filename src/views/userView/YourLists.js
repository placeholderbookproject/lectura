import React, {useState} from "react";
import { WatchListListElement } from "./UserElementInteractionsList";
const YourLists = props => {
    const [data, setData] = useState(props.data)
    return (<div className="header-container">{data.map((e,index) => <WatchListListElement element={e} index={index}/>)}</div>)
}
export default YourLists;