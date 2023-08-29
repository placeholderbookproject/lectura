import React, {useState, useEffect} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import TextComponent from './TextComponent';
import { setTab } from '../commonFuncs.js';
import DeleteData from './DeleteData';
import AuthorGeneral from './AuthorGeneral';
import ElementInteraction from '../ElementInteraction';
import { postTextInteraction } from '../apiEffects';
import TextHeader from './TextHeader';
const parse = require('html-react-parser');

const AuthorComponent = (props) => {
    let {text_id } = useParams();
    const {lang, userData} = props
    const navigate = useNavigate();
    const defaultTabs = { gen:true, det: false}
    const [tabOpen, setTabOpen] = useState(text_id===undefined?defaultTabs:{...defaultTabs, det:true})
    const [author, setAuthor] = useState();
    const [text, setText] = useState({})
    const baseLink = author&&`/author/${author.author_id}`
    const tabs = [{value:"gen",tabName:"General",component:<AuthorGeneral properties={{lang, userData, author, setAuthor, navigate}}/>}
                ,{value:"det",tabName:<TextHeader properties={{text, userData, text_id}}/>, component:(text_id)?<TextComponent properties = {{lang, text_id, userData, text, setText}}/>:<></>}]
    const [tabsContent, setTabsContent] = useState(tabs)
    const returnMain = () => {navigate(baseLink);setTabOpen(defaultTabs)}
    useEffect(() => {if(text_id){setTabOpen({...tabOpen, det:true})}else{setTabOpen({...tabOpen, det:false})}},[text_id])
    useEffect(() => {setTabsContent(tabs)},[author, text, text_id])
    const getTabs = () => {return tabOpen.det === true ? [...tabsContent].reverse() : tabsContent;};
    return (
    <div className="author-container">
        {author&&<div className="author-container-header">
                    <h2><a onClick={()=>{returnMain()}} className="author-header">{author.author_name} </a>
                    <a href={author.author_wikipedia?author.author_wikipedia:author.author_q?author.author_q:""}>{`(Wiki)`}</a>
                    {userData&&<ElementInteraction values={{user_id:userData.user_id, hash: userData.hash, id:author.author_id
                                ,condition:author["author_watch"], conditional:{true:"+",false:"+"}
                                ,button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, name:"author_watch", postFunction:postTextInteraction }}/>}
                    {userData&&<DeleteData properties={{type:"author", data:author, setData:setAuthor, userData}}/>}
                    </h2>
                </div>}
        <div className="dropdowns-container">
            {getTabs().map((tab) => (
                <div key={tab.tabName}>
                    <div className={`tab-container${tabOpen[tab.value]?'':"-inactive"}`}>
                        {tab.tabName}
                        <button className="tab-button" onClick={()=>setTab(tab.value,tabOpen,setTabOpen)}>{tabOpen[tab.value]?parse("&#8593;"):parse("&#8595;")}</button>
                    </div>
                    {tabOpen[tab.value]&&tab.component}
                </div>))}
        </div>
    </div>)
}

export default AuthorComponent