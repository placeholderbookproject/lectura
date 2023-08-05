import {useParams} from 'react-router-dom';
import TableRow from '../ViewRow.js'
import labels from '../labels.js'
import {useState, useEffect} from 'react';
import {reformatWikidata, checkData} from '../formattingFuncs';
import {fetchDataEffect, wikidataEffect} from '../apiEffects'
import { WikiExternalsLabels } from '../wikidata.js';
import TextInteraction from '../TextInteraction.js';
import { postTextInteraction } from '../apiEffects';
import { textRows } from './dataRows.js';

const TextTable = (props) => {
    const language = props.properties.lang.value
    const {setQ, userData, info, setInfo, setTextName} = props.properties;
    const elementInteractions = [{name:"checks", conditional:{true:"",false:""}, button_name:{true:"check-btn", false:"check-btn"}, label:"Check"},
                    {name:"watch", conditional:{true:"+",false:"+"}, button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, label:"Watchlist"}]
    const [data, setData] = useState({});
    const [wikidata, setWikidata] = useState();
    const {bookLabel, image, titleLabel} = info, rows = textRows(info, data)
    let { id } = useParams();
    const title = data&&data.text_title?data.text_title.split(","):"";
    props.properties.id?id=props.properties.id:void(0);
    useEffect(() => {fetchDataEffect({type:'texts', id, setData, user_id:userData?userData.user_id:0})();},[id, userData]);
    useEffect(()=> {
        if(data && data.text_q){
            setQ&&setQ(data.text_q);
            const q_number = data.text_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"texts", language})();
            setTextName(
                <h2 className = "Header">{checkData(bookLabel,title[0])} <a href={data.text_q}>(Wiki)</a>
                {Object.keys(data).length>0 && elementInteractions.map((e) =>
                        <TextInteraction values={{...e, condition:data[e.name], user_id:userData.user_id, hash:userData.hash,text_id:id, postFunction:postTextInteraction}}/>)
                    }</h2> )
        }},[data, language])
    useEffect(()=>{wikidata&&setInfo(reformatWikidata(wikidata))},[wikidata])
    return (
        <div id = "textTableWindow" className="person-info">
            {data.text_q&&<WikiExternalsLabels q_number={data.text_q} language={language}/>}
            {titleLabel!==title[0]&&<TableRow label={labels.original_title}>{titleLabel}</TableRow>}
            {image && !image.split(", ")[0].includes("djvu")&&<img src={image.split(", "[0])} style={{ maxWidth: "400px", maxHeight: "200px", objectFit: "contain" }} alt="img" />}
            {data&&<>{rows.map((row) => row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>)}
            </>}
        </div>
    )
  }

export default TextTable;