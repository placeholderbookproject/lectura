import React from 'react';
import ListsListItem from './ListsOfListItem';
const ListsOfLists = (props) => {return (props.lists&&props.lists.length>0
    &&props.lists.map((item) => <ListsListItem list_data = {item} key={item.list_name} tab={props.tab}/>))}
export default ListsOfLists;