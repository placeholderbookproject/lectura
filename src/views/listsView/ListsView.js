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
    const [pageLength, setPageLength] = useState({label:'10', value:10})
    const pageLengthOptions = [{label:'10', value:10},{label:'25',value:25},{label:'50', value:50},{label:'100', value:100},{label:"max", value:searchResults.length}]
    const handleChange = (e) => {setPageLength({value:e.target.value, label:e.target.label})}
    useEffect(() => {fetchAllLists(props.userData.user_id,setLists);},[props.userData.user_id]);
    useEffect(() => {
        const listType = searchType==="all"?"":searchType
        if(query.length>3){
            setSearchResults(lists.filter(element=> (element.list_description+element.list_name).includes(query)&&element.list_type.includes(listType)))}
       else {setSearchResults(lists.filter(element=> element.list_type.includes(listType)))}
    },[query,lists, searchType])
    console.log(Math.ceil(searchResults.length/pageLength.value))
    return (
        <div>
            <ListsSearch searchType={searchType} setSearchType={setSearchType} setQuery={setQuery} query={query}/>
            <div className="lists-header">
                {listTabs.map((tabBtn) =>
                    <button className={`lists-tab${tabBtn===tab?"-open":""}`} key={tabBtn} 
                        onClick = {() => setTab(tabBtn)}>{tabBtn.charAt(0).toUpperCase() + tabBtn.slice(1)}</button>)}
                <button className="lists-tab" onClick={()=>navigate("/lists/create_new")}>Create a new list</button>
            </div>
            <ListsOfLists lists={searchResults} tab={tab} userData={props.userData} searchResults={searchResults} setSearchResults={setSearchResults}/>
            <select value = {pageLength.value} label={pageLength.label} onChange = {handleChange} className="page-select">
              {pageLengthOptions.map((opt) => (<option key = {opt.value+opt.label} value = {opt.value}>{opt.label}</option>) )}
            </select>
            <div>
                {Array.from({ length: Math.ceil(searchResults.length/pageLength.value) }).map((_, index) => (
                <button key={index} >{index + 1}</button>
                ))}
            </div>
        </div>
    )
}
export default ListsTab;