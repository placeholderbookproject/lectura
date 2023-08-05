import {useState} from 'react';
import TextTable from './TextTable.js';
import { WikiExternalsList } from '../wikidata.js';
import { setTab } from '../commonFuncs.js';
import ArchiveList from './ArchiveList.js';
import CommentView from '../commentsView/CommentView.js';
import AddComment from '../commentsView/AddComment.js';

const TextComponent = props => {
    const {lang, text_id, userData, setTextName} = props.properties
    const [q, setQ] = useState();
    const defaultTabs = {"Text Info":true, "Sources": true};
    const [tabOpen, setTabOpen] = useState({...defaultTabs})
    const [info, setInfo] = useState({})
    const sources = [{name:"Archive.org", component:<ArchiveList info={info}/>}]
    const tabs = [{tabName:"Text Info", component:<><TextTable properties={{setQ, lang, id:text_id, userData, info, setInfo, setTextName}}/>{q&&<WikiExternalsList q_number={q} language={lang.value}/>}</>}
                ,{tabName:"Sources", component:Object.keys(info).length>0
                            &&<div className="source-container">{sources.map((source => source.component))}</div>}]
    return (
    <div className="text-container">
        <div className="dropdowns-container">
            {tabs.map((tab) => (<div key={tab.tabName}>
                    <button className={`tab-button${tabOpen[tab.tabName]?'':"-inactive"}`} onClick={(e)=>setTab(e,tabOpen,setTabOpen)}>
                        {tab.tabName}
                    </button>
                    {tabOpen[tab.tabName]&&tab.component}
                </div>))}
        </div>
        <div>
            <h3 className="comment-header">Comments</h3>
            {userData&&<AddComment user_id={userData.user_id} type="text" type_id ={text_id} buttonName="New Comment"/>}
            <CommentView comment_type="text" comment_type_id={text_id} userData={userData}/>
        </div>
    </div>
    )
}

export default TextComponent;