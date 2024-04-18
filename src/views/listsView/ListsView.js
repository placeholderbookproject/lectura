import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListsOfLists from './ListOfLists';
import { fetchAllLists } from '../apiEffects';
import ListsSearch from './ListsSearch';
import SortingGen from '../SortingGen';
import { reorderList } from '../commonFuncs';
const sortOption = [{value:'list_name',label:'List Name'}, {value:'list_created', label: 'List Created'}
                    ,{value:'likes', label:'Likes'}, {value:'dislikes', label: 'Dislikes'}]
const sortOptions = {"authors":sortOption, "texts":sortOption, "all":sortOption}
const ListsTab = ({userData, setUserData, labels, lang}) => {
    const navigate = useNavigate();
    const [searchParams,setSearchParams] = useSearchParams();
    const [lists,setLists] = useState([])
    const [searchType, setSearchType] = useState("all")
    const [searchResults, setSearchResults] = useState(lists);
    const [query, setQuery] = useState("");
    const listTabs = userData?["all", "official", "personal", "added by Me", "watchlist","deleted"]:["all","official","personal"]
    const [tab,setTab] = useState("all");
    const [sort, setSort] = useState(searchParams.has("sort")?{value:searchParams.get("sort"), order:searchParams.has("sort_order")?searchParams.get("sort_order"):"desc"}:{sort:'list_name', order:'desc'})
    useEffect(() => {fetchAllLists(userData.user_id,setLists);},[userData.user_id]);
    useEffect(() => {setSearchResults(reorderList(searchResults, sort.value, sort.order))},[sort])
    useEffect(() => {
        const listType = searchType==="all"?"":searchType
        if(query.length>3){
            setSearchResults(lists.filter(e=> (e.list_description+e.list_name).includes(query)&&e.list_type.includes(listType)))}
       else {setSearchResults(lists.filter(e=> e.list_type.includes(listType)))}
    },[query,lists, searchType])
    return (
        <div>
            <ListsSearch searchType={searchType} setSearchType={setSearchType} setQuery={setQuery} query={query} labels={labels}/>
            <SortingGen lang={lang} labels={labels} sortOptions={sortOptions} sort={sort} setSort={setSort} type={searchType} params={searchParams} setParams={setSearchParams} />
            <div className="lists-header">
                {listTabs.map((tabBtn) =>
                    <button className={`lists-tab${tabBtn===tab?"-open":""}`} key={tabBtn} 
                        onClick = {() => setTab(tabBtn)}>{tabBtn.charAt(0).toUpperCase() + tabBtn.slice(1)}</button>)}
                <button className="create-new-list-tab" onClick={()=>navigate("/lists/create_new")}>{labels.newList}</button>
            </div>
            <ListsOfLists properties = {{lists:searchResults, tab, userData, setUserData, searchResults, setSearchResults, labels}} />
        </div>
    )
}
export default ListsTab;