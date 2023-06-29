import React,{useState, useEffect} from 'react';
import ListsListItem from './ListsOfListItem';
import { fetchListInteractions } from '../apiEffects';
const ListsOfLists = (props) => {
    const {userData, lists, tab} = props
    const [listInteractions, setListInteractions] = useState(false)
    useEffect(() => {userData&&fetchListInteractions(userData.user_id, setListInteractions)},[])
    return (lists&&lists.length>0&&lists.map((item) => 
            <ListsListItem list_data = {item} key={item.list_name} tab={tab} userData={userData&&userData}
                        interactions={listInteractions&&listInteractions.length>0&&listInteractions.find(int => int.list_id === item.list_id)}/>))}
export default ListsOfLists;