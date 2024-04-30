import React,{useState, useEffect} from "react";
import { fetchUserElements } from "./apiEffects";
const Interactions = ({showInteract,setShowInteract}) => {
    const [interactions, setInteractions] = useState([])
    useEffect(() => {fetchUserElements(showInteract.type, showInteract.id, true,setInteractions)},[showInteract])
    return (interactions.length>0&&<div className="user-element-wrapper"><div className="user-element-content">
        <button onClick={()=>{setShowInteract({})}}>Exit</button>
        {interactions.map((int) => <p className="interaction-user-row">{int.user_name}</p>)}
    </div></div>)
}
export default Interactions;