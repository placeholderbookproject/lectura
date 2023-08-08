import React from "react";
import { setTab } from '../commonFuncs.js';
import CommentView from '../commentsView/CommentView.js';
import AddComment from '../commentsView/AddComment.js';

const TabComponent = props => {
    const {tabs, tabOpen, setTabOpen, data, type, userData} = props.properties
    const type_id = data&&data[`${type}_id`]
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
        {data&&<div>
            <h3 className="comment-header">Comments</h3>
            {userData&&<AddComment user_id={userData.user_id} type={type} type_id ={type_id} buttonName="New Comment"/>}
            <CommentView comment_type={type} comment_type_id={type_id} userData={userData}/>
        </div>}
    </div>
    )
}
export default TabComponent