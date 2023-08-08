import {useState} from 'react';
import TextTable from './TextTable.js';
import { WikiExternalsList } from '../wikidata.js';
import TextSources from './TextSources.js';
import ListReferences from './ListReferences.js';
import TabComponent from './TabComponent.js';

const TextComponent = props => {
    const {lang, text_id, userData, setTextName} = props.properties
    const [q, setQ] = useState();
    const defaultTabs = {"Text Info":true, "Sources": true, "Lists":false};
    const [tabOpen, setTabOpen] = useState({...defaultTabs})
    const [info, setInfo] = useState({})
    const tabs = [{tabName:"Text Info", component:<><TextTable properties={{setQ, lang, id:text_id, userData, info, setInfo, setTextName}}/>{q&&<WikiExternalsList q_number={q} language={lang.value}/>}</>}
                ,{tabName:"Sources", component:Object.keys(info).length>0&&info.bookLabel&&<TextSources info={info} lang={lang}/>}
                ,{tabName:"Lists", component:<ListReferences type="text" id={text_id}/>}]
    return (<TabComponent properties={{userData, tabs, tabOpen, setTabOpen, data:info, type:"text", id:text_id}} />)
}

export default TextComponent;