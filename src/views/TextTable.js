import {useParams} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'
import {useState, useEffect} from 'react';
import {transformYear, reformatWikidata, checkData, dateCoalesce} from './formattingFuncs';
import {fetchDataEffect, wikidataEffect} from './apiEffects'
import { ArchiveList } from './AuthorTable.js';
import ComponentPopup from './Popup.js';
//import {TextEdit} from './EditWindow.js';
//import {editRowAll} from './filters.js';

const TextTable = (props) => {
    const language = props.lang.value
    const [data, setData] = useState({});
    const [edit, setEdit] = useState(false);
    const [wikidata, setWikidata] = useState();
    let { id } = useParams();
    //const editRowData = editRowAll["texts"];
    const title = data&&data.text_title?data.text_title.split(","):"";
    const numTitles = title.length!==undefined?title.length:"";
    props.id?id=props.id:void(0);
    useEffect(()=> {
        if(data && data.text_q){
            const q_number = data.text_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"texts", language})();}},[data, language])
    const wikiReform = wikidata?reformatWikidata(wikidata):{};
    const {akaLabel, authorLabel, awardsLabel, bookLabel, bookdesc, copyrightLabel, dopYear, genreLabel, image,
        inceptionYear, languageLabel, lengthLabel, metreLabel, origincountryLabel, publYear, publishedInLabel,
        publisherLabel, titleLabel, typeLabel} = wikiReform
    const {text_author, author_id, text_language, text_original_publication_year, text_original_publication_length,
        text_original_publication_length_type} = data
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    useEffect(fetchDataEffect({type:'texts', id, setData}),[id]);
    useEffect(() => {setData(id)},[id])
    //const setEditWindow = () => {!edit?setEdit(true):setEdit(false)}
    return (
        <div id = "textTableWindow" className="person-info">
                <h2 className = "Header">{checkData(bookLabel,title[0])} <a href={data.text_q}>(Wiki)</a>
                {/*<button className = "editBtn" onClick = {setEditWindow} style = {{border:'None'}}>
                    <img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg" alt = "edit" width="25" height="30"/>
                </button>*/}
                </h2>
            {titleLabel!==title[0]&&<TableRow label={labels.original_title}>{titleLabel}</TableRow>}
            {image && <img src={image.split(", ")[0]} style={{ maxWidth: "400px", maxHeight: "200px", objectFit: "contain" }} alt="img" />}
            <TableRow label={labels.aka}>{(numTitles>1)&&checkData(akaLabel,title.slice(1,numTitles).join(", "))}</TableRow>
            {!edit&&data
            &&<>
                <TableRow>{bookdesc}</TableRow>
                <ComponentPopup id={author_id} key={author_id} lang={props.lang.value} type="author">
                    <TableRow label = {labels.author_name + " "} >{checkData(authorLabel,text_author)}</TableRow>
                </ComponentPopup>
                <TableRow label = {labels.written_date + " "}>
                    {transformYear(checkData(selectedDate,text_original_publication_year, labels.unspecified))}
                </TableRow>
                <TableRow label = {labels.language+ " "}>{checkData(languageLabel,text_language)}</TableRow>
                <TableRow label={"Origin Country "}>{origincountryLabel}</TableRow>
                <TableRow label={labels.genre}>{genreLabel}</TableRow>
                <TableRow label ={labels.type}>{typeLabel}</TableRow>
                <TableRow label={labels.metre}>{metreLabel}</TableRow>
                <TableRow label={"Published in "}>{publishedInLabel}</TableRow>
                <TableRow label={labels.publishers}>{publisherLabel}</TableRow>
                {text_original_publication_length !== null&&
                    <TableRow label = {labels.original_publication_length + " "}>
                        {checkData(lengthLabel,text_original_publication_length) + 
                        (text_original_publication_length_type !== "" && " " + text_original_publication_length_type + "")}
                    </TableRow>}
                <TableRow label={"Awards "}>{awardsLabel}</TableRow>
                <TableRow label={"Copyright Status "}>{copyrightLabel}</TableRow>
                {wikiReform&&bookLabel&&<ArchiveList title={bookLabel} name={authorLabel} originalTitle={titleLabel}/>}
            </>}
            {/*edit?<>
                <TextEdit cols = {editRowData} data = {data} origData = {props.text} setData = {setData}
                    type = "texts" id = {props.text} />
            </>
            :<></>*/
            }
        </div>
    )
  }

  export default TextTable;