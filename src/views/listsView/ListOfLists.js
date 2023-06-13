import React from 'react';
import ListsListItem from './ListsListItem';
const ListsOfLists = (props) => {
    const lists = props.lists
    return (lists&&lists.length>0&&lists.map((item) => <ListsListItem list_data = {item} key={item.list_name}/>))
}
export default ListsOfLists;