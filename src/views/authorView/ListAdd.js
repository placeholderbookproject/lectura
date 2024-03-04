import React,{useState, useEffect} from "react";
import ElementInteraction from "../ElementInteraction";
import { updateUserList, fetchElementLists, postTextInteraction, createNewList } from "../apiEffects";
import { elementInteractions } from "./dataRows";

const AddToListComponent = props => {
    const {data, setData, userData, list_type, type_id} = props.properties
    const [newList, setNewList] = useState("");
    const createList = () => {
        const listData = {list_info:{user_id:userData.user_id,hash:userData.hash, list_name:newList,list_description:"",list_type},
                    additions:[{value:type_id}], removals:[], order_changes:[],delete:false}
        createNewList(listData).then(result => setData([...data,{list_name:newList, in_list:true, list_type, value:type_id, list_id:result.list_id} ]))
    }
    const changeName = (e) => {setNewList(e.target.value)}
    return (
    <div className="element-list-element">
        <input type="text" name="new_list_name" value={newList} onChange={changeName} placeholder="List Name"/>
        <button onClick={()=>createList()} className="list-statistics-btn">Create</button>
    </div>

    )
}

const ListAdd = props => {
    const {list_type, type_id, userData, setUserData, watch} = props
    const interaction = list_type==="authors"?"author_watch":"watch"
    const [data, setData] = useState(props.data);
    const [isDropdownOpen,setIsDropdownOpen] = useState(false);
    const handleClick = () => {setIsDropdownOpen(!isDropdownOpen)}
    useEffect(() => {userData&&fetchElementLists(list_type,type_id,userData.user_id, userData.hash,setData)},[userData, list_type])
    const adjustList = (list_id, type) => {
        const additions = type==="add"?[{value:type_id}]:[]
        const removals = additions.length=0?[{value:type_id}]:[]
        updateUserList({userData,removals, additions,order_changes:[],delete:false, list_info:{list_id}})
        const updatedList = data.map(item => {
            if (item.list_id === list_id) {return { ...item, in_list: !item.in_list };} 
            else {return item;}
          }); setData(updatedList)
    }
    return (
        <div className="dropdown-container">
            <div className="list-dropdown-trigger" onMouseEnter={() => setIsDropdownOpen(true)} onClick = {handleClick}>
            {elementInteractions.map((e) =>
                e.name===interaction&&<ElementInteraction values={{...e, condition:watch, user_id:userData.user_id, hash:userData.hash,id:type_id,userData,setUserData, postFunction:postTextInteraction}}/>)}
            </div>
            {isDropdownOpen && userData &&
            <div className="dropdown-content">
                {data.map(list => <div className="element-list-element" key={list.list_id}><p className="list-name" onClick={handleClick}>{list.list_name}</p>
                                    {list.in_list?<button className="list-btn" onClick={()=>adjustList(list.list_id,"removal")}/>
                                                :<button className="watchlist-btn" onClick={()=>adjustList(list.list_id,"add")}>+</button>}
                                </div>)}
                <AddToListComponent properties = {{data, setData, userData, list_type, type_id}}/>
            </div>}
        </div>
    )
}

export default ListAdd