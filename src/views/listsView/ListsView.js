import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ListsListItem from './ListsListItem';
import { availableLists } from './availableLists';

const ListsTab = (props) => {
    const navigate = useNavigate();
    const listTabs = ["all", "official", "personal", "added by Me", "watchlist"]
    const [tab,setTab] = useState("all");
    return (
        <div>
            <div className="lists-header">
                {listTabs.map((tabBtn) =>
                    <button className={`lists-tab${tabBtn===tab?"-open":""}`} key={tabBtn} onClick = {() => setTab(tabBtn)}>{tabBtn.charAt(0).toUpperCase() + tabBtn.slice(1)}</button>)}
                <button className="lists-tab" onClick={()=>navigate("/lists/create_new")}>Create a new list</button>
            </div>
            {availableLists[tab]&&availableLists[tab].map((item) => 
                <ListsListItem img={item.img} title={item.title} description={item.descr} type={tab} url={item.url} key={item.url}/>)}
        </div>
    )
}

export default ListsTab;