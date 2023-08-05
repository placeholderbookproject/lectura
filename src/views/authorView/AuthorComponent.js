import React, {useState} from 'react';
import AuthorTable from './AuthorTable';
import WikiExternalsList from '../wikidata';
import TextsWikiTable from './AuthorTexts';
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import TextComponent from './TextComponent';
import { setTab } from '../commonFuncs.js';

const AuthorComponent = (props) => {
    let { text_id } = useParams();
    const {lang, userData} = props
    const navigate = useNavigate(), location = useLocation();
    const defaultTabs = {bio:true, lit:true, det: false}
    const [tabOpen, setTabOpen] = useState(text_id===undefined?defaultTabs:{...defaultTabs, det:true})
    const [q, setQ] = useState();
    const [author, setAuthor] = useState();
    const [textName, setTextName] = useState(false);
    const baseLink = author&&`/author/${author.author_id}`
    const handleClick = (id = null) => {
        const url = `${baseLink}/text/${id}`
        text_id = id;
        if (url!==location.pathname && id) {
            const detailed = tabOpen["det"]
            setTabOpen({...tabOpen, det:!detailed})
            url !== location && navigate(url)
        } else {setTabOpen(defaultTabs);navigate(baseLink)}
    }
    const tabs = [{value:"bio",tabName:"Biography",component:<><AuthorTable setQ={setQ} lang={lang} setAuthor={setAuthor}/>{q&&<WikiExternalsList q_number={q} language={props.lang.value}/>}</>},
                {value:"lit",tabName:"Literature",component:author&&<TextsWikiTable author = {author} language={lang} handleClick={handleClick}/>},
                {value:"det",tabName:textName, component:(text_id)?<TextComponent properties = {{lang, text_id, userData, setTextName}} />:<></>},]
    const reversedTabs = (tabOpen.det===true)?tabs.reverse():tabs
    const returnMain = () => {navigate(baseLink);setTabOpen(defaultTabs)}
    return (
    <div className="author-container">
        {author&&<div className="author-container-header">
                    <h2><a onClick={()=>{returnMain()}} className="author-header">{author.author_name} </a>
                    <a href={author.author_q?author.author_q:""}>{`(Wiki)`}</a></h2>
                </div>}
        <div className="dropdowns-container">
            {reversedTabs.map((tab) => (
                <div key={tab.tabName}>
                    <div className="tab-container"><button className={`tab-button${tabOpen[tab.value]?'':"-inactive"}`} 
                        onClick = {()=>{setTab(tab.value, tabOpen, setTabOpen);tab.value==="det"&&setTextName(false)}}>{tab.tabName}</button></div>
                    {tabOpen[tab.value]&&tab.component}
                </div>))}
        </div>
    </div>)
}

export default AuthorComponent