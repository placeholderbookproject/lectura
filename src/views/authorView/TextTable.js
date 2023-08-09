import TableRow from '../ViewRow.js'
import labels from '../labels.js'
import {useState, useEffect} from 'react';
import {checkData} from '../formattingFuncs';
import {fetchDataEffect, wikidataEffect} from '../apiEffects'
import ElementInteraction from '../ElementInteraction.js';
import { postTextInteraction } from '../apiEffects';
import { textRows } from './dataRows.js';
import DeleteData from './DeleteData.js';

const TextTable = (props) => {
    const language = props.properties.lang.value
    const {setQ, userData, info, setInfo, setTextName,id} = props.properties;
    const elementInteractions = [{name:"checks", conditional:{true:"",false:""}, button_name:{true:"check-btn", false:"check-btn"}, label:"Check"},
                    {name:"watch", conditional:{true:"+",false:"+"}, button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, label:"Watchlist"}]
    const [data, setData] = useState({});
    const [wikidata, setWikidata] = useState();
    const {bookLabel, image, titleLabel} = info, rows = textRows(info, data)
    const title = data&&data.text_title?data.text_title.split(","):"";
    useEffect(() => {fetchDataEffect({type:'texts', id, setData, user_id:userData?userData.user_id:0})();},[id, userData]);
    useEffect(()=>{wikidata&&setInfo(({...data,...wikidata}))},[wikidata])
    useEffect(()=> {
        if(data && data.text_q){
            setQ&&setQ(data.text_q);
            const q_number = data.text_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"texts", language})();
            setTextName(
                <h2 className = "Header">{checkData(bookLabel,title[0])} <a href={data.text_q}>(Wiki)</a>
                {Object.keys(data).length>0 && elementInteractions.map((e) =>
                        <ElementInteraction values={{...e, condition:data[e.name], user_id:userData.user_id, hash:userData.hash,id, postFunction:postTextInteraction}}/>)}
                {userData&&<DeleteData properties={{type:"text", data, setData, userData}}/>}
                </h2>)} 
    },[language, data.text_q, id])
    return (
        <div id = "textTableWindow" className="person-info">
            {titleLabel!==title[0]&&<TableRow label={labels.original_title}>{titleLabel}</TableRow>}
            {image && !image.split(", ")[0].includes("djvu")&&<img src={image.split(", "[0])} className="text-img" alt="img"/>}
            {data&&<>{rows.map((row) => row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>)}
            </>}
        </div>
    )
  }

export default TextTable;