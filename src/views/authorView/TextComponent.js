import {useState} from 'react';
import TextTable from './TextTable.js';
import { WikiExternalsList } from '../wikidata.js';
import { setTab } from '../commonFuncs.js';

const TextComponent = props => {
    const [q, setQ] = useState();
    const defaultTabs = {"Text Info":true};
    const [tabOpen, setTabOpen] = useState({...defaultTabs})
    const tabs = [{tabName:"Text Info", component:<><TextTable setQ={setQ} lang={props.lang} id = {props.id}/>
                    {q&&<WikiExternalsList q_number={q} language={props.lang.value}/>}</>}]
    return (
        <div className="dropdowns-container">
            {tabs.map((tab) => (
                <div key={tab.tabName}>
                    <button className={`tab-button${tabOpen[tab.tabName]?'':"-inactive"}`} onClick = {(e) => setTab(e, tabOpen, setTabOpen)}>
                        {tab.tabName}
                    </button>
                    {tabOpen[tab.tabName]&&tab.component}
                </div>))}
        </div>
    )
}

export default TextComponent;