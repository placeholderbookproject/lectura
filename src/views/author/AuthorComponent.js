import React, {useState} from 'react';
import AuthorTable from './AuthorTable';
import WikiExternalsList from '../wikidata';
import TextsWikiTable from './AuthorTexts';

export const AuthorComponent = (props) => {
    const [tabOpen, setTabOpen] = useState({Biography:true, Literature:true, Identifiers:false})
    const [q, setQ] = useState();
    const [externalStaples, setExternalStaples] = useState();
    const [author, setAuthor] = useState();
    const setTab = (name) => {
        const oldTab = tabOpen
        setTabOpen({...oldTab, [name]:!tabOpen[name]})
    }
    return (
        <div className="dropdowns-container">
            <div>
                <button className={`tab-button${tabOpen.Biography?'':"-inactive"}`} onClick = {() => setTab("Biography")}>Biography</button>
                {tabOpen.Biography&&<AuthorTable setQ={setQ} lang={props.lang} externalStaples={externalStaples} setAuthor={setAuthor}/>}
            </div>
            <div>
                <button className={`tab-button${tabOpen.Literature?'':"-inactive"}`} onClick = {() => setTab("Literature")}>Literature</button>
                {author&&tabOpen.Literature&&<TextsWikiTable author = {author} language={props.lang}/>}
            </div>
            <div>
                <button className={`tab-button${tabOpen.Identifiers?'':"-inactive"}`} onClick = {() => setTab("Identifiers")}>Identifiers</button>
                {q&&tabOpen.Identifiers&&<WikiExternalsList q_number={q} language={props.lang.value} setExternalStaples={setExternalStaples}/>}
            </div>
        </div>
    )
}

export default AuthorComponent