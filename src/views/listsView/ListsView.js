import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import ListsOfLists from './ListOfLists';
import { officialLists } from './availableLists';
import { fetchAllLists } from '../apiEffects';
import ListsSearch from './ListsSearch';

const ListsTab = (props) => {
    const navigate = useNavigate();
    const [personal,setPersonal] = useState([])
    const [searchType, setSearchType] = useState("all")
    const [searchResults, setSearchResults] = useState({"personal":personal?personal:[]
                                        , "official":officialLists?officialLists:[]
                                        ,"added by Me":personal&&personal.length>0&&props.userData&&[personal.filter(list => list.user_id === props.userData.user_id)]
                                    });
    const [query, setQuery] = useState("");
    const listTabs = props.userData?["all", "official", "personal", "added by Me", "watchlist"]:["all","official","personal"]
    const [tab,setTab] = useState("all");
    useEffect(() => {fetchAllLists(setPersonal)},[]);
    useEffect(() => {
        const oldResults = searchResults;
        const listType = searchType==="all"?"":searchType
        if(query.length>3){setSearchResults(
                {"personal":personal.filter(element => (element.list_description+element.list_name).includes(query)&&element.list_type.includes(listType)),
                "official":officialLists.filter(element => (element.list_description+element.list_name).includes(query)&&element.list_type.includes(listType)),
                "added by Me":oldResults['added by Me']})}
       else {setSearchResults({"personal":personal.filter(element =>element.list_type.includes(listType))
                            ,"official":officialLists.filter(element =>element.list_type.includes(listType))
                            ,"added by Me":props.userData&&[personal.filter(list => list.user_id === props.userData.user_id)]})}
    },[query,personal, searchType])
    return (
        <div>
            <ListsSearch searchType={searchType} setSearchType={setSearchType} setQuery={setQuery} query={query}/>
            <div className="lists-header">
                {listTabs.map((tabBtn) =>
                    <button className={`lists-tab${tabBtn===tab?"-open":""}`} key={tabBtn} 
                        onClick = {() => setTab(tabBtn)}>{tabBtn.charAt(0).toUpperCase() + tabBtn.slice(1)}</button>)}
                <button className="lists-tab" onClick={()=>navigate("/lists/create_new")}>Create a new list</button>
            </div>
            {tab==="all"?<ListsOfLists lists={[...searchResults.official, ...searchResults.personal]} tab={tab}/>:<ListsOfLists lists={searchResults[tab]} tab={tab}/>}
        </div>
    )
}
export default ListsTab;