import TableRow from '../ViewRow.js'
import labels from '../labels.js'
import {useState, useEffect} from 'react';
import {fetchDataEffect, wikidataEffect} from '../apiEffects'
import { textRows } from './dataRows.js';

const TextTable = (props) => {
    const language = props.properties.lang.value
    const {setQ, userData, text, setText,id} = props.properties;
    const [data, setData] = useState({});
    const [wikidata, setWikidata] = useState();
    const [rows, setRows] = useState(textRows(text))
    const {image, titleLabel} = text
    const title = data&&data.text_title?data.text_title.split(","):"";
    useEffect(() => {fetchDataEffect({type:'texts', id, setData, user_id:userData?userData.user_id:0})();},[id, userData]);
    useEffect(()=>{if(wikidata){setText(({...data,...wikidata}));setRows(textRows({...data,...wikidata}))}},[wikidata])
    useEffect(()=> {
        if(data && data.text_q){
            setQ&&setQ(data.text_q);
            const q_number = data.text_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"texts", language})();
        } 
    },[language, data.text_q, id])
    return (
        <div id = "textTableWindow" className="person-info">
            {titleLabel!==title[0]&&<TableRow label={labels.original_title}>{titleLabel}</TableRow>}
            {image && !image.split(", ")[0].includes("djvu")&&<img src={image.split(", "[0])} className="text-img" alt="img"/>}
            {text&&<>{rows.map((row) => row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>)}
            </>}
        </div>
    )
  }

export default TextTable;