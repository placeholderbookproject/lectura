import React from 'react';
import ListsListItem from './ListsListItem';
const ListsOfLists = (props) => {
    const {userData,setUserData, lists, tab, searchResults, setSearchResults} = props
    const tabFilter = {all:lists,personal:lists.filter(element => element.tab==="personal")
                        ,official:lists.filter(element=>element.tab==="official")
                        ,"added by Me":userData&&lists.filter(element=>element.user_id===userData.user_id)
                        ,watchlist:lists.filter(e=>e.watchlist)}
    return (lists&&lists.length>0&&tabFilter[tab].map((item) => 
            <ListsListItem list_data = {item} key={item.list_name} tab={tab} userData={userData&&userData} setUserData={setUserData}
                searchResults={searchResults} setSearchResults={setSearchResults}/>))}
export default ListsOfLists;