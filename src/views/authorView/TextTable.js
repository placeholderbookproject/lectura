import {useParams} from 'react-router-dom';
import TableRow from '../ViewRow.js'
import labels from '../labels.js'
import {useState, useEffect} from 'react';
import {transformYear, reformatWikidata, checkData, dateCoalesce} from '../formattingFuncs';
import {fetchDataEffect, wikidataEffect} from '../apiEffects'
import ArchiveList from '../ArchiveList.js';
import { WikiExternalsLabels } from '../wikidata.js';

const TextTable = (props) => {
    const language = props.lang.value
    const [data, setData] = useState({});
    const [wikidata, setWikidata] = useState();
    let { id } = useParams();
    const title = data&&data.text_title?data.text_title.split(","):"";
    const numTitles = title.length!==undefined?title.length:"";
    props.id?id=props.id:void(0);
    useEffect(()=> {
        if(data && data.text_q){
            props.setQ&&props.setQ(data.text_q);
            const q_number = data.text_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"texts", language})();}},[data, language])
    const wikiReform = wikidata?reformatWikidata(wikidata):{};
    const {akaLabel, authorLabel, awardsLabel, bookLabel, bookdesc, copyrightLabel, dopYear, genreLabel, image,
        inceptionYear, languageLabel, lengthLabel, metreLabel, origincountryLabel, publYear, publishedInLabel,
        publisherLabel, titleLabel, typeLabel, formLabel} = wikiReform
    const {text_author, author_id, text_language, text_original_publication_year, text_original_publication_length,
        text_original_publication_length_type, text_q} = data
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    useEffect(() => {
        setData(id);
        fetchDataEffect({type:'texts', id, setData})();
    },[id]);
    const rows = [{label:labels.aka,content:(numTitles>1)&&checkData(akaLabel,title.slice(1,numTitles).join(", "))},
                {label:"", content:bookdesc},{label:labels.author_name + " ", content:checkData(authorLabel, text_author)},
                {label:labels.written_date, content:checkData(transformYear(checkData(selectedDate,text_original_publication_year, labels.unspecified)))},
                {label:labels.language, content:checkData(languageLabel,text_language)},{label:"Origin Country ", content:origincountryLabel},
                {label:labels.genre, content:genreLabel},{label:labels.type, content:typeLabel},{label:"Form ", content:formLabel},
                {label:labels.metre, content:metreLabel},{label:"Published in ", content:publishedInLabel},{label:labels.publishers, content:publisherLabel},
                {label:labels.original_publication_length, content:text_original_publication_length !== null&&checkData(lengthLabel,text_original_publication_length) + 
                    (text_original_publication_length_type !== "" && " " + text_original_publication_length_type + "")},
                {label:"Awards ", content:awardsLabel},{label:"Copyright Status ", content:copyrightLabel}]
    return (
        <div id = "textTableWindow" className="person-info">
            {text_q&&<WikiExternalsLabels q_number={text_q} language={language}/>}
            <h2 className = "Header">{checkData(bookLabel,title[0])} <a href={data.text_q}>(Wiki)</a></h2>
            {titleLabel!==title[0]&&<TableRow label={labels.original_title}>{titleLabel}</TableRow>}
            {image && !image.split(", ")[0].includes("djvu")&&<img src={image.split(", "[0])} style={{ maxWidth: "400px", maxHeight: "200px", objectFit: "contain" }} alt="img" />}
            {data&&<>
                {rows.map((row) => row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>)}
                {wikiReform&&bookLabel&&<ArchiveList title={bookLabel} name={authorLabel} originalTitle={titleLabel}/>}
            </>}
        </div>
    )
  }

export default TextTable;