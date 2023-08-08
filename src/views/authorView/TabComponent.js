import React from "react";
import { setTab } from '../commonFuncs.js';
import CommentView from '../commentsView/CommentView.js';
import AddComment from '../commentsView/AddComment.js';

const TabComponent = props => {
    const {tabs, tabOpen, setTabOpen, data, type, userData, id} = props.properties
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
        {data&&<div className="comment-section">
            <h3 className="comment-header">Comments</h3>
            {userData&&<AddComment user_id={userData.user_id} type={type} type_id ={id} buttonName="New Comment"/>}
            <CommentView comment_type={type} comment_type_id={id} userData={userData}/>
        </div>}
    </div>
    )
}
export default TabComponent