import React,{useState, useEffect} from "react";
import { fetchUserElements } from "./apiEffects";
const Interactions = ({showInteract,setShowInteract}) => {
    const [interactions, setInteractions] = useState([])
    useEffect(() => {fetchUserElements(showInteract.type, showInteract.id, true,setInteractions)},[showInteract])
    return (interactions.length>0&&<div className="user-element-wrapper"><div className="user-element-content">
        <button onClick={()=>{setShowInteract({})}} className="exit-interactions">X</button>
        <h2 className="interaction-header">{showInteract.type.charAt(0).toUpperCase() + showInteract.type.slice(1)}</h2>
        {interactions.map((int) => <p className="interaction-user-row"><a href={`/user/show/${int.user_name}`}>{int.user_name}</a></p>)}
    </div></div>)
}
export default Interactions;