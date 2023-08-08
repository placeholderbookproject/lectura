import React, {useState} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import TextComponent from './TextComponent';
import { setTab } from '../commonFuncs.js';
import DeleteData from './DeleteData';
import AuthorGeneral from './AuthorGeneral';

const AuthorComponent = (props) => {
    let { text_id } = useParams();
    const {lang, userData} = props
    const navigate = useNavigate();
    const defaultTabs = { gen:true, det: false}
    const [tabOpen, setTabOpen] = useState(text_id===undefined?defaultTabs:{...defaultTabs, det:true})
    const [author, setAuthor] = useState();
    const [textName, setTextName] = useState(false);
    const baseLink = author&&`/author/${author.author_id}`
    const tabs = [{value:"gen",tabName:"General",component:<AuthorGeneral properties={{lang, userData, author, setAuthor, navigate, setTextName}}/>},
                {value:"det",tabName:textName, component:(text_id)?<TextComponent properties = {{lang, text_id, userData, setTextName}}/>:<></>},]
    const reversedTabs = (tabOpen.det===true)?tabs.reverse():tabs
    const returnMain = () => {navigate(baseLink);setTabOpen(defaultTabs)}
    return (
    <div className="author-container">
        {author&&<div className="author-container-header">
                    <h2><a onClick={()=>{returnMain()}} className="author-header">{author.author_name} </a>
                    <a href={author.author_q?author.author_q:""}>{`(Wiki)`}</a>
                    {userData&&<DeleteData properties={{type:"author", data:author, setData:setAuthor, userData}}/>}
                    </h2>
                </div>}
        <div className="dropdowns-container">
            {reversedTabs.map((tab) => (
                <div key={tab.tabName}>
                    <div className="tab-container"><div className={`tab-button${tabOpen[tab.value]?'':"-inactive"}`} 
                        onClick = {()=>{setTab(tab.value, tabOpen, setTabOpen);tab.value==="det"&&setTextName(false)}}>{tab.tabName}</div></div>
                    {tabOpen[tab.value]&&tab.component}
                </div>))}
        </div>
    </div>)
}

export default AuthorComponent