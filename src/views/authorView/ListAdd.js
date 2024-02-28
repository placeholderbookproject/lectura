import React,{useState, useEffect} from "react";
import ElementInteraction from "../ElementInteraction";
import { updateUserList, fetchElementLists, postTextInteraction } from "../apiEffects";
import { elementInteractions } from "./dataRows";

const ListAdd = props => {
    const {list_type, type_id, userData, setUserData, watch} = props
    const [data, setData] = useState(props.data);
    const [isDropdownOpen,setIsDropdownOpen] = useState(false);
    const handleClick = () => {setIsDropdownOpen(!isDropdownOpen)}
    useEffect(() => {fetchElementLists(list_type,type_id,userData.user_id, userData.hash,setData)},[props])
    const adjustList = (list_id, type) => {
        const additions = type==="add"?[{value:type_id}]:[]
        const removals = additions.length=0?[{value:type_id}]:[]
        updateUserList({userData,removals, additions,order_changes:[],delete:false, list_info:{list_id}})
        const updatedList = data.map(item => {
            if (item.list_id === list_id) {return { ...item, in_list: !item.in_list };} 
            else {return item;}
          });
        setData(updatedList)
    }
    return (
        <div className="dropdown-container">
            <div className="list-dropdown-trigger" onMouseEnter={() => setIsDropdownOpen(true)} onClick = {handleClick}>
            {elementInteractions.map((e) =>
                e.name==="watch"&&<ElementInteraction values={{...e, condition:watch, user_id:userData.user_id, hash:userData.hash,id:type_id,userData,setUserData, postFunction:postTextInteraction}}/>)}
            </div>
            {isDropdownOpen &&
            <div className="dropdown-content">
                {data.map(list => <div className="element-list-element"><p className="list-name" onClick={handleClick}>{list.list_name}</p>
                                    {list.in_list?<button className="list-btn" onClick={()=>adjustList(list.list_id,"removal")}/>
                                                :<button className="watchlist-btn" onClick={()=>adjustList(list.list_id,"add")}>+</button>}
                                </div>)}
                <button>Make a List</button>
            </div>}
        </div>
    )
}

export default ListAdd