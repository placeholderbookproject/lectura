import React, {useState} from 'react';
import AuthorTable from './AuthorTable';
import WikiExternalsList from '../wikidata';
import TextsWikiTable from './AuthorTexts';

export const AuthorComponent = (props) => {
    const [tabOpen, setTabOpen] = useState({Biography:true, Literature:true, Identifiers:false})
    const [q, setQ] = useState();
    const [author, setAuthor] = useState();
    const setTab = (event) => {
        const oldTab = tabOpen,tab = event.target.textContent
        setTabOpen({...oldTab, [tab]:!tabOpen[tab]})
    }
    const tabs = [{tabName:"Biography",component:<AuthorTable setQ={setQ} lang={props.lang} setAuthor={setAuthor}/>},
                {tabName:"Literature",component:author&&<TextsWikiTable author = {author} language={props.lang}/>},
                {tabName:"Lit. detailed", component:<></>},
            {tabName:"Identifiers",component:q&&<WikiExternalsList q_number={q} language={props.lang.value}/>}]
    return (
        <div className="authorContainer">
            {author&&<h2>{author.author_name} <a href={author.author_q?author.author_q:""}>{`(Wiki)`}</a></h2>}
            <div className="dropdowns-container">
                {tabs.map((tab) => (
                    <div key={tab.tabName}>
                        <button className={`tab-button${tabOpen[tab.tabName]?'':"-inactive"}`} onClick = {(e) => setTab(e)}>{tab.tabName}</button>
                        {tabOpen[tab.tabName]&&tab.component}
                    </div>))}
            </div>
        </div>)
}

export default AuthorComponent