import React,{useState, useEffect} from "react";
import { setTab } from '../commonFuncs.js';
import CommentSection from "../commentsView/CommentSection.js";

const TabComponent = props => {
    const {tabs, tabOpen, setTabOpen, data, type, userData} = props.properties
    const [id,setId] = useState(false)
    useEffect(()=>data&&setId(data&&data[`${type}_id`]),[data])
    return (    
    <div className="text-container">
        <div className="dropdowns-container">
            {tabs.map((tab) => (<div key={tab.tabName}>
                    <button className={`tab-button${tabOpen[tab.tabName]?'':"-inactive"}`} onClick={()=>setTab(tab.tabName,tabOpen,setTabOpen)}>
                        {tab.tabName}
                    </button>
                    {tabOpen[tab.tabName]&&tab.component}
                </div>))}
        </div>
        {data&&id&&<CommentSection properties={{userData, type, type_id:id, buttonName:"New Comment"}}/>}
    </div>
    )
}
export default TabComponent