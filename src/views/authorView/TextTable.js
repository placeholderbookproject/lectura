import TableRow from '../ViewRow.js'
import labels from '../labels.js'
import {useState, useEffect} from 'react';
import {wikidataEffect} from '../apiEffects'
import { textRows } from './dataRows.js';

const TextTable = (props) => {
    const language = props.properties.lang.value
    const {setQ} = props.properties;
    const [text, setText] = useState(props.properties.text)
    const {image, titleLabel} = text
    const title = text&&text.text_title?text.text_title.split(","):"";
    useEffect(()=> {
        if(props.properties.text && props.properties.text.text_q){
            setQ&&setQ(props.properties.text.text_q);
            const q_number = props.properties.text.text_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata:setText, type:"texts", language})().then(data => {setText(({...props.properties.text,...data}))});
        } 
    },[language, props.properties.text])
    return (
        <div id = "textTableWindow" className="person-info">
            {titleLabel!==title[0]&&<TableRow label={labels.original_title}>{titleLabel}</TableRow>}
            {image && !image.split(", ")[0].includes("djvu")&&<img src={image.split(", "[0])} className="text-img" alt="img"/>}
            {text&&<>{textRows(text).map((row) => row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>)}
            </>}
        </div>
    )
  }

export default TextTable;