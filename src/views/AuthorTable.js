import React, {/*useRef,*/ useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import TableRow from './ViewRow.js';
import labels from './labels.js';
//import AuthorTexts from './AuthorTexts.js';
import { /*fetchComments,*/ fetchDataEffect, wikidataEffect, archiveEffect} from './apiEffects.js';
import {checkStr, transformYear, reformatWikidata, reformatWikitexts, dateCoalesce, removeDuplicateList, checkData, removeWorksOutOfBounds} from './formattingFuncs.js';
//import {AuthorEdit} from './EditWindow.js';
//import {editRowAll} from './filters.js';
//import { Comment } from './Comments.js';

const AuthorTable = (props) => {
    const language = props.lang.value
    const [data, setData] = useState({});
    const [edit, setEdit] = useState(false);
    const [wikidata, setWikidata] = useState();
    const [wikiTextdata, setWikiTextdata] = useState();
    const authorReform = wikidata?reformatWikidata(wikidata):{};
    const {author, authordesc, authorLabel, akaLabel,genderLabel, birthdate, birthyear, birthplaceLabel, birthplacecountryLabel,
        deathdate, deathyear, deathplaceLabel,deathplacecountryLabel, floruit, occupationsLabel, languagesLabel, nativenameLabel, imageLabel
        ,citizenshipLabel} 
        = authorReform;
    const {author_q, author_name, author_nationality, author_birth_year, author_birth_city, author_birth_country,
        author_death_year, author_death_city, author_death_country, author_floruit, author_positions, author_name_language
    } = data
    const textsReform = wikiTextdata?reformatWikitexts(wikiTextdata):null;
    let { id } = useParams();
    props.id?id=props.id:void(0);
    //const editRowData = editRowAll["authors"];
    const name = data && author_name ? author_name.split(",") : "";
    const numNames = name.length;
    const akaWiki = akaLabel&&(akaLabel.split(", ").length>5?akaLabel.split(", ").slice(0,4).join(", "):akaLabel)
    useEffect(() => {
        if(data && author_q){
            const q_number = author_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"author", language})();
            wikidataEffect({q_number,setWikidata:setWikiTextdata,type:"author_texts", language})();}
    },[data, language])
    useEffect(fetchDataEffect({type:'authors', id, setData}) , [id]);
    useEffect(() => {setData(id)},[id])
    //const setEditWindow = () => {!edit?setEdit(true):setEdit(false)}
    return (
        name&&
        <div id = "authorTableWindow" className="person-info" style={{backgroundColor:"white"}}>
                <h2 className ="Header">{checkData(authorLabel,name[0]) + " "}
                    {data && author_q?<a href={data && author_q?author_q:""}>{`(Wiki)`}</a>:<></>}
                    {/*<button className = "editBtn" onClick = {setEditWindow} style = {{border:'None'}}>*/}{/*!edit?labels.editBtn:labels.exitEditBtn*/}
                        {/*<img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg" alt = "edit" width="25" height="30"/>
                    </button>*/}
                </h2>
                <TableRow label = {labels.aka + " "}>{checkData(akaWiki,numNames>1?name.slice(1,numNames).join(", "):null)}</TableRow>
                {nativenameLabel&&<TableRow label = {labels.nativeName + " "}>{nativenameLabel}{genderLabel&&` (${genderLabel})`}</TableRow>}
                {imageLabel && <img src={imageLabel.split(", ")[0]} style={{ maxWidth: "400px", maxHeight: "200px", objectFit: "contain" }} />}
                {authordesc&&<p>{authordesc}</p>}
            {!edit&&data
                ?<>
                    <TableRow label = {labels.nationality + " "}>{checkData(citizenshipLabel,author_nationality)}</TableRow>
                    <TableRow label = {labels.born + " "}>
                        {transformYear(checkData(birthyear&&birthyear.split(", ").pop(),author_birth_year), labels.unspecified)}
                        {" " +checkStr(checkData(birthplaceLabel,author_birth_city), checkData(birthplacecountryLabel,author_birth_country))}
                    </TableRow>
                    <TableRow label = {labels.died + " "}>
                        {transformYear(checkData(deathyear&&deathyear.split(", ").pop(),author_death_year), labels.unspecified)}
                        {" " + checkStr(checkData(deathplaceLabel,author_death_city), checkData(deathplacecountryLabel,author_death_country))}
                    </TableRow>
                        {(author_birth_year === null|author_death_year === null) && author_floruit !==null
                            ?<TableRow label = {labels.floruit + " "}>{checkData(floruit,author_floruit)}</TableRow>
                            :<></>}
                    <TableRow label = {labels.occupation + " "}>{checkData(occupationsLabel,author_positions)}</TableRow>
                    <TableRow label={labels.languages + " "}>{checkData(languagesLabel, author_name_language)}</TableRow>
                </>:<></>}
                {/*edit?<AuthorEdit cols = {editRowData} data = {data} origData = {id} setData = {setData}
                    type = "authors" id = {id}/>:<></>*/
            }
            <TextsWikiTable wikitexts={textsReform} name={checkData(authorLabel,name[0])} author = {data}/>
            </div>
    );
  }

const TextsWikiTable = (props) => {
    const {wikitexts, name, author} = props
    const [storedtexts,setStoredtexts] = useState();
    const [expandTexts, setExpandTexts] = useState(false)
    useEffect (fetchDataEffect({setData:setStoredtexts, id:author.author_id, type:'texts', by: "author"}),[author])
    const texts = storedtexts&&
        removeWorksOutOfBounds(removeDuplicateList(storedtexts,wikitexts, "text_q"),author.author_birth_year, author.author_death_year)
    return (
    texts&&texts.length>0&&
    <div>
        <h3 onClick = {() => setExpandTexts(!expandTexts)}>{name+"'s Texts "}{`(${texts.length})`}</h3>
        {texts&&texts.slice(0,(!expandTexts?5:texts.length)).map(
            (text) => 
                <SubTextsTable data={text} key={text.book} name = {props.name}/>)}
        {texts&&texts.length>5&&
            <button onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(texts.length-5) + " texts"}</button>}
    </div>)    
}

const SubTextsTable = (props) => {
    const {bookLabel, publYear,dopYear, inceptionYear, book, titleLabel, text_id} = props.data
    const bookLabelReform = bookLabel.split(" | ").length>1?bookLabel.split(" | ").pop():bookLabel
    const link = text_id&&"/text/"+text_id
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <div className="text-info">
            <p>
                <a href={checkData(link,book)}>{bookLabelReform}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}</a>
                <button onClick = {() => {setDetailed(!detailed)}}>{detailed?"-":"+"}</button>
            </p>
            {detailed&&<>
                <DetailedTexts data = {props.data} name={props.name}/>
                {detailed&&<ArchiveList title={bookLabelReform} name={props.name} originalTitle={titleLabel}/>}
            </>}
        </div>)
}

const DetailedTexts = (props) => {
    const {bookLabel, bookdesc, titleLabel, typeLabel, genreLabel, publYear, publication, languageLabel, origincountryLabel
        ,dopYear, inception, inceptionYear, metreLabel, book, publisherLabel, lengthLabel} = props.data
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <>
            <TableRow label={labels.original_title}>{titleLabel}</TableRow>
            <TableRow label={labels.written_date}>{transformYear(selectedDate)}</TableRow>
            <TableRow label={labels.language}>{languageLabel}</TableRow>
            <TableRow label={labels.genre}>{genreLabel}</TableRow>
            <TableRow label={labels.type}>{typeLabel}</TableRow>
            <TableRow label={labels.metre}>{metreLabel}</TableRow>
            {lengthLabel&&<TableRow label={labels.length}>{lengthLabel + " pages"}</TableRow>}
            <TableRow label={labels.publishers}>{publisherLabel}</TableRow>
            <TableRow label={"Wiki "}><a href={book}>{book.replace("http://www.wikidata.org/entity/","")}</a></TableRow>
        </>
    )
}

export const ArchiveList = (props) => {
    const [archive, setArchive] = useState();
    const [showArchive, setShowArchive] = useState(false)
    const {title, name, originalTitle} = props
    useEffect(() => {archiveEffect({title:title.split(", "[0]), name, setArchive, originalTitle})();},[])
    return (
    <div>
        {archive&&archive.length>0&&
        <p onClick = {() => setShowArchive(!showArchive)}>
            <span style={{fontWeight:600}}>Archive.org Results</span>
        </p>}
        {showArchive&&
        archive.map((result) => 
        <p key={result.identifier}>
            <a href={'https://archive.org/details/'+result.identifier}>
        {`${result.title} by ${result.creator} (${result.year}) (${result.downloads} downloads) (${result.language}) (${result.mediatype})`}
            </a>
        </p>)}
    </div>)
}

export default AuthorTable;