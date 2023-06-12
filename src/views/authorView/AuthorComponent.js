import React, {useState/*, useEffect*/} from 'react';
import AuthorTable from './AuthorTable';
import WikiExternalsList from '../wikidata';
import TextsWikiTable from './AuthorTexts';
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import TextComponent from './TextTable';
import { setTab } from '../commonFuncs.js';

const AuthorComponent = (props) => {
    let { text_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation()
    const defaultTabs = {Biography:true, Literature:true}
    const [tabOpen, setTabOpen] = useState(text_id===undefined?defaultTabs:{...defaultTabs, "Lit. detailed":true})
    const [q, setQ] = useState();
    const [author, setAuthor] = useState();
    const baseLink = author&&`/author/${author.author_id}`
    const handleClick = (id = null) => {
        const url = `${baseLink}/text/${id}`
        text_id = id;
        if (url!==location.pathname && id) {
            const detailed = tabOpen["Lit. detailed."]
            setTabOpen({...tabOpen, "Lit. detailed":!detailed})
            url !== location && navigate(url)
        } else {setTabOpen(defaultTabs);navigate(baseLink)}
    }
//    useEffect(() => {location.pathname!==baseLink&&navigate(baseLink);},[id])
    const tabs = [{tabName:"Biography",component:<><AuthorTable setQ={setQ} lang={props.lang} setAuthor={setAuthor}/>{q&&<WikiExternalsList q_number={q} language={props.lang.value}/>}</>},
                {tabName:"Literature",component:author&&<TextsWikiTable author = {author} language={props.lang} handleClick={handleClick}/>},
                {tabName:"Lit. detailed", component:text_id?<TextComponent lang={props.lang} id={text_id}/>:<p>Please Select a Text</p>},]
    const returnMain = () => {navigate(baseLink);setTabOpen(defaultTabs)}
    return (
        <div className="author-container">
            {author&&<div className="author-container-header">
                <h2><a onClick={() => {returnMain()}} className="author-header">{author.author_name} </a>
                    <a href={author.author_q?author.author_q:""}>{`(Wiki)`}</a></h2>
                {/*<button>Delete</button>*/}
                </div>}
            <div className="dropdowns-container">
                {tabs.map((tab) => (
                    <div key={tab.tabName}>
                        <button className={`tab-button${tabOpen[tab.tabName]?'':"-inactive"}`} onClick = {(e) => setTab(e, tabOpen, setTabOpen)}>{tab.tabName}</button>
                        {tabOpen[tab.tabName]&&tab.component}
                    </div>))}
            </div>
        </div>)
}

export default AuthorComponent