import React, {/*useRef,*/ useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import TableRow from './ViewRow.js';
import labels from './labels.js';
import AuthorTexts from './AuthorTexts.js';
import {searchWikipediaEffect, /*fetchComments,*/ fetchDataEffect, wikidataEffect, archiveEffect} from './apiEffects.js';
import {checkStr, transformYear, reformatWikidata, reformatWikitexts, dateCoalesce} from './formattingFuncs.js';
import {AuthorEdit} from './EditWindow.js';
import {editRowAll} from './filters.js';
//import { Comment } from './Comments.js';
const parse = require('html-react-parser');

const checkData = (data1,data2) => {
    if(data1===null||data1===undefined||data1===""){return data2}
    else{return data1}
}

const AuthorTable = (props) => {
    const [wiki, setWiki] = useState("");
    const [data, setData] = useState();
    const [edit, setEdit] = useState(false);
//    const [wikiResults, setWikiResults] = useState();
    const [wikidata, setWikidata] = useState();
    const [wikiTextdata, setWikiTextdata] = useState();
    const authorReform = wikidata?reformatWikidata(wikidata):{};
    const textsReform = wikiTextdata?reformatWikitexts(wikiTextdata):null;
    const {author, authordesc, authorLabel, akaLabel,genderLabel, birthdate, birthyear, birthplaceLabel, birthplacecountryLabel,
        deathdate, deathyear, deathplaceLabel,deathplacecountryLabel, floruit, occupationsLabel, languagesLabel, nativenameLabel, imageLabel} 
        = authorReform    
    let { id } = useParams();
    props.id?id=props.id:void(0);
    const editRowData = editRowAll["authors"];
    const name = data && data.author_name ? data.author_name.split(",") : "";
    const numNames = name.length;
    const occupationList = data?.author_positions?.split(", ") ?? "";
    useEffect(() => {
        if(data && data.author_q){
            const q_number = data.author_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"author"})();
        wikidataEffect({q_number,setWikidata:setWikiTextdata,type:"author_texts"})();}
    },[data])
    useEffect(fetchDataEffect({type:'authors', id:id, setData:setData}) , [id]);
    useEffect(() => {setData(id)},[id])
    //useEffect (searchWikipediaEffect({setWiki, edit, name:name[0], mainOccupation}),[name,mainOccupation, edit, id])
    const setEditWindow = () => {!edit?setEdit(true):setEdit(false)}
    return (
        <div id = "authorTableWindow" className="person-info" style={{backgroundColor:"white"}}>
                <h2 className ="Header">{checkData(authorLabel,name[0]) + " "}
                    {data && data.author_q?<a href={data && data.author_q?data.author_q:""}>{`(Wiki)`}</a>:<></>}
                    <button className = "editBtn" onClick = {setEditWindow} style = {{border:'None'}}>{/*!edit?labels.editBtn:labels.exitEditBtn*/}
                        <img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg" alt = "edit" width="25" height="30"/>
                    </button>
                </h2>
                <TableRow label = {labels.aka + " "}>{checkData(akaLabel,numNames>1?name.slice(1,numNames).join(", "):null)}</TableRow>
                {nativenameLabel&&<TableRow label = {labels.nativeName + " "}>{nativenameLabel}{genderLabel&&` (${genderLabel})`}</TableRow>}
                {imageLabel && <img src={imageLabel.split(", ")[0]} style={{ maxWidth: "400px", maxHeight: "200px", objectFit: "contain" }} />}
                {authordesc&&<p>{authordesc}</p>}
            {!edit&&data
                ?<>
                    <TableRow label = {labels.nationality + " "}>{data.author_nationality}</TableRow>
                    <TableRow label = {labels.born + " "}>
                        {transformYear(checkData(birthyear,data.author_birth_year), labels.unspecified)}
                        {" " +checkStr(checkData(birthplaceLabel,data.author_birth_city), checkData(birthplacecountryLabel,data.author_birth_country))}
                    </TableRow>
                    <TableRow label = {labels.died + " "}>
                        {transformYear(checkData(deathyear,data.author_death_year), labels.unspecified)}
                        {" " + checkStr(checkData(deathplaceLabel,data.author_death_city), checkData(deathplacecountryLabel,data.author_death_country))}
                    </TableRow>
                        {(data.author_birth_year === null|data.author_death_year === null) && data.author_floruit !==null
                            ?<TableRow label = {labels.floruit + " "}>{checkData(floruit,data.author_floruit)}</TableRow>
                            :<></>}
                    <TableRow label = {labels.occupation + " "}>{checkData(occupationsLabel,data.author_positions)}</TableRow>
                    <TableRow label={labels.languages + " "}>{checkData(languagesLabel, data.author_name_language)}</TableRow>
                    {/*<TableRow> {typeof wiki !== Object && wiki !== ""? parse(wiki):<></>}</TableRow>*/}
                </>:<></>}
                {/*edit?<AuthorEdit cols = {editRowData} data = {data} origData = {id} setData = {setData}
                    type = "authors" id = {id}/>:<></>*/
            }
                {/*<AuthorTexts edit = {edit} author_id = {id}/>*/}
                {textsReform && textsReform.length>0
                    ?<TextsWikiTable texts={textsReform} name={authorLabel}/>
                    :<></>}
            </div>
    );
  }

  const TextsWikiTable = (props) => {
    const {texts, name} = props
    const [expandTexts, setExpandTexts] = useState(false)
    return (
    <div>
        <h3>{name+"'s Texts "}{`(${texts.length})`}</h3>
        {texts&&texts.slice(0,(!expandTexts?5:texts.length)).map((text) => <SubTextsTable data={text} key={text.book} name = {props.name}/>)}
        {texts&&texts.length>5&&
            <button onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(texts.length-5) + " texts"}</button>}
    </div>)
}

const SubTextsTable = (props) => {
    const {bookLabel, publYear,dopYear, inceptionYear, book, titleLabel} = props.data
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <div className="text-info">
            <p><a href={book}>{bookLabel.split(", ")[0]}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}</a>
                <button onClick = {() => {setDetailed(!detailed)}}>
                    {detailed?"-":"+"}{/*<img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/dropdown-1427583-1209253.png?f=avif&w=512" width="4" height="2"/>*/}
                    </button>{/*"https://cdn.iconscout.com/icon/free/png-512/free-dropdown-keyboard-arrow-menu-key-direction-30471.png?f=avif&w=512"*/}
            </p>
            {detailed
            ?<>
                <DetailedTexts data = {props.data} name={props.name}/>
                {detailed&&<ArchiveList title={bookLabel} name={props.name} originalTitle={titleLabel}/>}
            </>
            :<></>}

        </div>
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
        </p>
        )
        }
    </div>
    )

}

const DetailedTexts = (props) => {
    const {bookLabel, bookdesc, titleLabel, typeLabel, genreLabel, publYear, publication, languageLabel, origincountryLabel
        ,dopYear, inception, inceptionYear, metreLabel, book, publisherLabel, lengthLabel} = props.data
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <>
            {titleLabel&&<p><span style = {{"fontWeight": 600,}}>Original Title </span>{titleLabel}</p>}
            {selectedDate&&<p><span style = {{"fontWeight": 600,}}>Written </span>{transformYear(selectedDate)}</p>}
            {languageLabel&&<p><span style = {{"fontWeight": 600,}}>Language </span>{languageLabel}</p>}
            {genreLabel&&<p><span style = {{"fontWeight": 600,}}>Genre </span>{genreLabel}</p>}
            {typeLabel&&<p><span style = {{"fontWeight": 600,}}>Type </span>{typeLabel}</p>}
            {metreLabel&&<p><span style = {{"fontWeight": 600,}}>Metre </span>{metreLabel}</p>}
            {lengthLabel&&<p><span style={{"fontWeight":600,}}>Length </span>{lengthLabel + " pages"}</p>}
            {publisherLabel&&<p><span style = {{"fontWeight": 600,}}>Publishers </span>{publisherLabel}</p>}
        </>
    )
}

const AuthorComments = props => {
    //const [comments, setComments] = useState([]);
    //const [newComment, setNewComment] = useState("");
    //const author_id = id;
    //useEffect(fetchComments({author_id, setComments}),[id])
    /*const handleAddComment = () => {
        const commentId = generateUniqueId(); // Generate a unique id for the new comment
        const newCommentObj = {
          id: commentId,
          comment: newComment,
          user_id: "user_id",
          date: new Date().toISOString(),
          likes: 0,
          replies: []
        };
        // Add the new comment to the existing comments dictionary
        const updatedComments = comments;
        updatedComments.push(newCommentObj);
        setComments(updatedComments);
        // Reset the input field for adding new comments
        setNewComment("");
      };
      const generateUniqueId = () => {
        return Math.random().toString(36).substr(2, 9);
      };*/

    return (
            {/*<p>
            <input value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button onClick={handleAddComment}>Add Comment</button>
        </p>*/
        /*comments.map((comment) => 
            (<Comment comment={comment}/>
        ))*/}
    )

}

export default AuthorTable;