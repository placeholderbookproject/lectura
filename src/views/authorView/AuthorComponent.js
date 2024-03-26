import React, {useState, useEffect} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import TextComponent from './TextComponent';
import { setTab } from '../commonFuncs.js';
import DeleteData from './DeleteData';
import AuthorGeneral from './AuthorGeneral';
import { fetchDataEffect, extractWiki} from '../apiEffects';
import {removeDuplicatesList, combineLists, skimList} from '../formattingFuncs.js';
import TextHeader from './TextHeader';
import ListAdd from './ListAdd.js';
const parse = require('html-react-parser');

const AuthorComponent = (props) => {
    const {id, text_id} = useParams();
    const {lang, userData, setUserData,labels} = props
    const navigate = useNavigate();
    const [tabOpen, setTabOpen] = useState(text_id!==undefined?{gen:true, det:true}:{gen:true, det: false})
    const [author, setAuthor] = useState();
    const [text, setText] = useState({});
    const [texts, setTexts] = useState({});
    const tabs = [{value:"gen",tabName:"Author Overview",component:<AuthorGeneral properties={{lang, userData, author,texts, navigate, setUserData, labels}}/>}
                ,Object.keys(text).length>0&&{value:"det",tabName:<TextHeader properties={{text, userData, text_id, setUserData}}/>, component:<TextComponent properties = {{lang, text_id, userData, text}}/>}]
    const returnMain = () => {navigate(`/author/${author.author_id}`);setTabOpen({gen:true, det: false});setText({})}
    useEffect(() => {
        if(id) {
            fetchDataEffect({type:'authors', id, setData:setAuthor,user_id:userData.user_id})()
            .then(results => Promise.all([extractWiki(results,results.author_q, "author",lang.value,"author_q"),
                            extractWiki([],results.author_q, "author_texts",lang.value, "text_q"),
                            fetchDataEffect({setData:setTexts, id, type:'texts', by: "author", user_id:userData.user_id})()]))
            .then(([authors, texts, textsDB]) => {setAuthor(authors); setTexts(skimList(removeDuplicatesList(combineLists(texts, textsDB, 'text_q'),"text_q"),'languageLabel',authors.languagesLabel))})
        }},[id, userData.user_id, lang.value])
    useEffect(() => {
        if(text_id) {
            fetchDataEffect({type:'texts', id:text_id, setData:setText, user_id:userData?userData.user_id:0})()
            .then(results => extractWiki(results,results.text_q, "texts", lang.value,"text_q")).then(wiki => setText(wiki));
            setTabOpen({...tabOpen, det:true});}
        else {setTabOpen({...tabOpen, det:false})}  
        },[text_id, lang.value, userData.user_id])
    const getTabs = () => {return tabOpen.det === true ? [...tabs].reverse() : tabs;};
    return (
    <div className="author-container">
        {author&&<div className="author-container-header">
                    <h2><a onClick={()=>{returnMain()}} className="author-header">{author.author_name}</a>
                    <a href={author.article?author.article:author.author_q?author.author_q:""}>{`(Wiki)`}</a>
                    {author&&<ListAdd list_type="authors" type_id={author.author_id} userData={userData} setUserData={setUserData} watch={author.author_watch}/>}
                    {userData&&userData.user_role==='administrator'&&<DeleteData properties={{type:"author", data:author, setData:setAuthor, userData}}/>}
                    </h2>
                </div>}
        <div className="author-component-container">
            {getTabs().map((tab) => tab.value&&tabOpen[tab.value]&&(
                <div key={tab.tabName}>
                    <div className={`tab-container${tabOpen[tab.value]?'':"-inactive"}`}>
                        {tab.tabName}
                        <button className="tab-button" onClick={()=>setTab(tab.value,tabOpen,setTabOpen)}>{tabOpen[tab.value]?parse("&#8593;"):parse("&#8595;")}</button>
                    </div>
                    {tab.component}
                </div>))}
        </div>
    </div>)
}

export default AuthorComponent