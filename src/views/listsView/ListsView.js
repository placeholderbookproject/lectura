import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import ListsOfLists from './ListOfLists';
import { fetchAllLists } from '../apiEffects';
import ListsSearch from './ListsSearch';

const ListsTab = (props) => {
    const navigate = useNavigate();
    const [lists,setLists] = useState([])
    const [searchType, setSearchType] = useState("all")
    const [searchResults, setSearchResults] = useState(lists);
    const [query, setQuery] = useState("");
    const listTabs = props.userData?["all", "official", "personal", "added by Me", "watchlist"]:["all","official","personal"]
    const [tab,setTab] = useState("all");
    useEffect(() => {fetchAllLists(props.userData.user_id,setLists);},[props.userData.user_id]);
    useEffect(() => {
        const listType = searchType==="all"?"":searchType
        if(query.length>3){
            setSearchResults(lists.filter(element=> (element.list_description+element.list_name).includes(query)&&element.list_type.includes(listType)))}
       else {setSearchResults(lists.filter(element=> element.list_type.includes(listType)))}
    },[query,lists, searchType])
    return (
        <div>
            <ListsSearch searchType={searchType} setSearchType={setSearchType} setQuery={setQuery} query={query}/>
            <div className="lists-header">
                {listTabs.map((tabBtn) =>
                    <button className={`lists-tab${tabBtn===tab?"-open":""}`} key={tabBtn} 
                        onClick = {() => setTab(tabBtn)}>{tabBtn.charAt(0).toUpperCase() + tabBtn.slice(1)}</button>)}
                <button className="create-new-list-tab" onClick={()=>navigate("/lists/create_new")}>+ Create a new list</button>
            </div>
            <ListsOfLists lists={searchResults} tab={tab} userData={props.userData} setUserData={props.setUserData} searchResults={searchResults} setSearchResults={setSearchResults}/>
        </div>
    )
}
export default ListsTab;