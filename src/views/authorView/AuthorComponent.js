import React, {useState, useEffect} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import TextComponent from './TextComponent';
import { setTab } from '../commonFuncs.js';
import DeleteData from './DeleteData';
import AuthorGeneral from './AuthorGeneral';
import ElementInteraction from '../ElementInteraction';
import { postTextInteraction, fetchDataEffect } from '../apiEffects';
import TextHeader from './TextHeader';
const parse = require('html-react-parser');

const AuthorComponent = (props) => {
    const {id, text_id} = useParams();
    const {lang, userData, setUserData} = props
    const navigate = useNavigate();
    const [tabOpen, setTabOpen] = useState(text_id!==undefined?{gen:true, det:true}:{gen:true, det: false})
    const [author, setAuthor] = useState();
    const [text, setText] = useState({})
    const tabs = [{value:"gen",tabName:"General",component:<AuthorGeneral properties={{lang, userData, author, setAuthor, navigate}}/>}
                ,{value:"det",tabName:<TextHeader properties={{text, userData, text_id, setUserData}}/>, component:(text&&text.text_q)?<TextComponent properties = {{lang, text_id, userData, text}}/>:<></>}]
    const returnMain = () => {navigate(`/author/${author.author_id}`);setTabOpen({gen:true, det: false})}
    useEffect(() => {console.log(id)
            if(id) {
                fetchDataEffect({type:'authors', id, setData:setAuthor,user_id:userData.user_id})()
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
                    <a href={author.author_wikipedia?author.author_wikipedia:author.author_q?author.author_q:""}>{`(Wiki)`}</a>
                    {<ElementInteraction values={{user_id:userData.user_id, hash: userData.hash, id:author.author_id, userData, setUserData
                                ,condition:author["author_watch"], conditional:{true:"+",false:"+"}
                                ,button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, name:"author_watch", postFunction:postTextInteraction }}/>}
                    {userData&&userData.user_role==='administrator'&&<DeleteData properties={{type:"author", data:author, setData:setAuthor, userData}}/>}
                    </h2>
                </div>}
        <div className="author-component-container">
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