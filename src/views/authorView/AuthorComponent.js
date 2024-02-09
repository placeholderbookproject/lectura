import React, {useState, useEffect} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import TextComponent from './TextComponent';
import { setTab } from '../commonFuncs.js';
import DeleteData from './DeleteData';
import AuthorGeneral from './AuthorGeneral';
import ElementInteraction from '../ElementInteraction';
import { postTextInteraction, fetchDataEffect, wikidataEffect } from '../apiEffects';
import TextHeader from './TextHeader';
const parse = require('html-react-parser');

const extractWiki = (results,q, type, language) => {
    const q_number = q.replace("http://www.wikidata.org/entity/","")
    return wikidataEffect({q_number, type, setWikidata:null,language})().then(wiki => {return {...wiki, ...results}})
}

const AuthorComponent = (props) => {
    const {id, text_id} = useParams();
    const {lang, userData, setUserData} = props
    const navigate = useNavigate();
    const [tabOpen, setTabOpen] = useState(text_id!==undefined?{gen:true, det:true}:{gen:true, det: false})
    const [author, setAuthor] = useState();
    const [text, setText] = useState({});
    const tabs = [{value:"gen",tabName:"General",component:<AuthorGeneral properties={{lang, userData, author, navigate, setUserData}}/>}
                ,Object.keys(text).length>0&&{value:"det",tabName:<TextHeader properties={{text, userData, text_id, setUserData}}/>, component:<TextComponent properties = {{lang, text_id, userData, text, setText}}/>}]
    const returnMain = () => {navigate(`/author/${author.author_id}`);setTabOpen({gen:true, det: false});setText({})}
    useEffect(() => {
        if(id) {
            fetchDataEffect({type:'authors', id, setData:setAuthor,user_id:userData.user_id})()
            .then(results => extractWiki(results,results.author_q, "author",lang.value))
            .then(wiki => setAuthor(wiki))
            if(text_id) {
                fetchDataEffect({type:'texts', id:text_id, setData:setText, user_id:userData?userData.user_id:0})();
                setTabOpen({...tabOpen, det:true});}
            else {setTabOpen({...tabOpen, det:false})}
        }},[id, text_id, userData])
    const getTabs = () => {return tabOpen.det === true ? [...tabs].reverse() : tabs;};
    return (
    <div className="author-container">
        {author&&<div className="author-container-header">
                    <h2><a onClick={()=>{returnMain()}} className="author-header">{author.author_name} </a>
                    <a href={author.article?author.article:author.author_q?author.author_q:""}>{`(Wiki)`}</a>
                    {<ElementInteraction values={{user_id:userData.user_id, hash: userData.hash, id:author.author_id, userData, setUserData
                                ,condition:author["author_watch"], conditional:{true:"+",false:"+"}
                                ,button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, name:"author_watch", postFunction:postTextInteraction }}/>}
                    {userData&&userData.user_role==='administrator'&&<DeleteData properties={{type:"author", data:author, setData:setAuthor, userData}}/>}
                    </h2>
                </div>}
        <div className="author-component-container">
            {getTabs().map((tab) => tab.value&&(
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