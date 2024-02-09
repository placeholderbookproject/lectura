import React, {useState, useEffect} from 'react';
import TextTable from './TextTable.js';
import { WikiExternalsList } from '../wikidata.js';
import TextSources from './TextSources.js';
import ListReferences from './ListReferences.js';
import TabComponent from './TabComponent.js';

const TextComponent = props => {
    const {lang, text_id, userData} = props.properties
    const [text, setText] = useState(props.properties.text)
    const [q, setQ] = useState();
    const defaultTabs = {"Text Info":true, "Sources": true, "Lists":false};
    const [tabOpen, setTabOpen] = useState({...defaultTabs})
    const tabs = [{tabName:"Text Info", component:<><TextTable properties={{setQ, lang, id:text_id, userData, text}}/>{q&&<WikiExternalsList q_number={q} language={lang.value}/>}</>}
                ,{tabName:"Sources", component:Object.keys(text).length>0&&text.bookLabel&&<TextSources text={text} lang={lang}/>}
                ,{tabName:"Lists", component:<ListReferences type="text" id={text_id}/>}]
    useEffect(()=>setText(props.properties.text),[props.properties.text])
    return (<TabComponent properties={{userData, tabs, tabOpen, setTabOpen, data:text, type:"text"}} />)
}

export default TextComponent;