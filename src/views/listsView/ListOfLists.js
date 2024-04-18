import React from 'react';
import ListsListItem from './ListsListItem';
const ListsOfLists = (props) => {
    const {userData,setUserData, lists, tab, searchResults, setSearchResults} = props.properties
    const tabFilter = {all:lists,personal:lists.filter(e => e.tab==="personal")
                        ,official:lists.filter(e=>e.tab==="official")
                        ,"added by Me":userData&&lists.filter(e=>e.user_id===userData.user_id)
                        ,watchlist:lists.filter(e=>e.watchlist)
                        ,deleted:lists.filter(e=>e.list_deleted&&e.user_id===userData.user_id)}
    return (lists&&lists.length>0&&tabFilter[tab].map((item) => 
            <ListsListItem list_data = {item} key={item.list_name} tab={tab} userData={userData&&userData} setUserData={setUserData}
                searchResults={searchResults} setSearchResults={setSearchResults}/>))}
export default ListsOfLists;