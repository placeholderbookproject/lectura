import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import ListsOfLists from './ListOfLists';
import { officialLists } from './availableLists';
import { fetchAllLists } from '../apiEffects';

const ListsTab = (props) => {
    const navigate = useNavigate();
    const [personal,setPersonal] = useState([])
    const listTabs = props.userData?["all", "official", "personal", "added by Me", "watchlist"]:["all","official","personal"]
    const lists = {"official":officialLists,"personal":personal
            , "added by Me":personal&&personal.length>0&&props.userData&&[personal.find(list => list.user_id === props.userData.user_id)]}
    const [tab,setTab] = useState("all");
    useEffect(() => {fetchAllLists(setPersonal)},[]);
    return (
        <div>
            <div className="lists-header">
                {listTabs.map((tabBtn) =>
                    <button className={`lists-tab${tabBtn===tab?"-open":""}`} key={tabBtn} 
                        onClick = {() => setTab(tabBtn)}>{tabBtn.charAt(0).toUpperCase() + tabBtn.slice(1)}</button>)}
                <button className="lists-tab" onClick={()=>navigate("/lists/create_new")}>Create a new list</button>
            </div>
            {tab==="all"?<ListsOfLists lists={[...lists.official, ...lists.personal]} tab={tab}/>:<ListsOfLists lists={lists[tab]} tab={tab}/>}
        </div>
    )
}
export default ListsTab;