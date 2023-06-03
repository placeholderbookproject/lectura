import React, {useState} from 'react';
import ListsListItem from './ListsListItem';
import { availableLists } from './availableLists';

const ListsTab = () => {
    const listTabs = ["All", "Official", "Personal", "Added by Me", "Watchlist"]
    const [tab,setTab] = useState("All");
    return (
        <div>
            <div className="lists-header">
                {listTabs.map((tabBtn) =>
                    <button className={`lists-tab${tabBtn===tab?"-open":""}`} key={tabBtn} onClick = {() => setTab(tabBtn)}>{tabBtn}</button>)}
            </div>
            {availableLists[tab]&&availableLists[tab].map((item) => 
                <ListsListItem img={item.img} title={item.title} description={item.descr} type={tab} url={item.url}/>)}
        </div>
    )
}

export default ListsTab;