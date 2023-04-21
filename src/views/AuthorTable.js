import React, {/*useRef,*/ useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import TableRow from './ViewRow.js';
import labels from './labels.js';
import AuthorTexts from './AuthorTexts.js';
import {searchWikipediaEffect, fetchComments, fetchDataEffect, wikidataEffect, archiveEffect} from './apiEffects.js';
import {checkStr, transformYear, reformatWikidata, reformatWikitexts, dateCoalesce} from './formattingFuncs.js';
import {AuthorEdit} from './EditWindow.js';
import {editRowAll} from './filters.js';
import { Comment } from './Comments.js';
import { wikiTranslations } from './filters.js';
const parse = require('html-react-parser');

const AuthorTable = (props) => {
    const [wiki, setWiki] = useState("");
    const [data, setData] = useState();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [edit, setEdit] = useState(false);
    const { id } = useParams();
    const editRowData = editRowAll["authors"];
    const name = data && data.author_name ? data.author_name.split(",") : "";
    const numNames = name.length;
    const occupationList = data?.author_positions?.split(", ") ?? "";
    const mainOccupation = occupationList[0];
    const author_id = id;
    useEffect(fetchDataEffect({type:'authors', id:id, setData:setData}) , [id]);
    useEffect(() => {setData(id)},[id])
    useEffect(fetchComments({author_id, setComments}),[id])
    useEffect (searchWikipediaEffect({setWiki, edit, name:name[0], mainOccupation}),[name,mainOccupation, edit, id])
    const setEditWindow = () => {!edit?setEdit(true):setEdit(false)}
    const handleAddComment = () => {
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
      };
    return (
        <div style = {{display:'inline-flex'}}>
        {data&&!data.author_q&&
        <table id = "authorTableWindow"><tbody>
            <tr className = "Header">
                <th>{name[0]}
                    <button className = "editBtn" onClick = {setEditWindow} style = {{border:'None'}}>{/*!edit?labels.editBtn:labels.exitEditBtn*/}
                        <img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg" alt = "edit" width="25" height="30"/>
                    </button>
                </th>
            </tr>
            <tr><td>{numNames>1?labels.aka + name.slice(1,numNames).join(", "):<></>}</td></tr>
            {!edit&&data
                ?<>
                    <TableRow label = {labels.nationality + " "}>{data.author_nationality}</TableRow>
                    <TableRow label = {labels.born + " "}>
                        {transformYear(data.author_birth_year, labels.unspecified)}
                        {" " +checkStr(data.author_birth_city, data.author_birth_country)}
                    </TableRow>
                    <TableRow label = {labels.died + " "}>
                        {transformYear(data.author_death_year, labels.unspecified)}
                        {" " + checkStr(data.author_death_city, data.author_death_country)}
                    </TableRow>
                        {(data.author_birth_year === null|data.author_death_year === null) && data.author_floruit !==null
                            ?<TableRow label = {labels.floruit + " "}>
                                {" " + data.author_floruit}
                            </TableRow>
                            :<></>}
                    <TableRow label = {labels.occupation + " "}>
                        {mainOccupation}
                        {occupationList.length>1
                            ?", " + labels.other_occupations + occupationList.slice(1,occupationList.length).join(", ")
                            :<></>}
                    </TableRow>
                    <TableRow> {typeof wiki !== Object && wiki !== ""? parse(wiki):<></>}</TableRow>
                    <TableRow label = {labels.author_q + " "}>
                        <a href={data.author_q}>{data.author_q?data.author_q.replace("http://www.wikidata.org/entity/",""):""}</a>
                    </TableRow>
                </>:<></>}
                {edit?<AuthorEdit cols = {editRowData} data = {data} origData = {id} setData = {setData}
                    type = "authors" id = {id}/>:<></>
            }
                <AuthorTexts edit = {edit} author_id = {id}/>
                <tr><td>
                    <input value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <button onClick={handleAddComment}>Add Comment</button>
                </td></tr>
                {comments.map((comment) => 
                    (<tr><td><Comment comment={comment}/></td></tr>
                ))}
            </tbody></table>
            }
            {data && data.author_q?<AuthorWikiTable data = {data.author_q.replace("http://www.wikidata.org/entity/","")}/>:<></>}
            </div>
    );
  }

const AuthorWikiTable = (props) => {
    const [wikidata, setWikidata] = useState();
    useEffect(() => {wikidataEffect({q_number:props.data, setWikidata, type:"author"})();},[])
    const {author, authordesc, authorLabel, genderLabel, birthdate, birthyear, birthplaceLabel, birthplacecountryLabel,
    deathdate, deathyear, deathplaceLabel,deathplacecountryLabel, floruit, occupationsLabel, languagesLabel, nativenameLabel, imageLabel} 
        = wikidata?reformatWikidata(wikidata):{};
    return (
        <div className="person-info">
            {/*<h2>Wikidata</h2>*/}
            <h2><a href={author&&author}>{authorLabel}</a></h2>
            {nativenameLabel&&<p>{`Native Name: ${nativenameLabel}`}{genderLabel&&` (${genderLabel})`}</p>}
            {imageLabel && <img src={imageLabel} style={{ width: "200px", height: "200px", objectFit: "cover" }} />}
            {authordesc&&<p>{authordesc}</p>}
            {birthyear&&<p><span style = {{fontWeight:600}}>Born </span>{``+transformYear(birthyear) + ` (${birthplaceLabel}` 
                    + `, ${birthplacecountryLabel})`}</p>}
            {deathyear&&
                <p><span style = {{fontWeight:600}}>Died </span>{``+transformYear(deathyear) + ` (${deathplaceLabel}` + `, ${deathplacecountryLabel})`}
                </p>}
            {!(birthdate||deathdate)&&floruit&&
                <p>{`Floruit: ${floruit}`}</p>
            }
            {occupationsLabel&& <p><span style = {{fontWeight:600}}>Occupations </span>{`${occupationsLabel}`}</p>}
            {languagesLabel&&<p><span style = {{fontWeight:600}}>Languages </span>{`${languagesLabel}`}</p>}
            {wikidata?<TextsWikiTable data={props.data} name={authorLabel}/>:<></>}
        </div>
      );
};

const TextsWikiTable = (props) => {
    const [wikidata, setWikidata] = useState();
    const [expandTexts, setExpandTexts] = useState(false)
    useEffect(() => {wikidataEffect({q_number:props.data,setWikidata,type:"author_texts"})();},[]);
    const textsReform = wikidata?reformatWikitexts(wikidata):null;
    return (
    <div>
        {textsReform&&textsReform.length>0&&<h3>{props.name+"'s Texts "}{`(${textsReform.length})`}</h3>}
        {textsReform&&textsReform.slice(0,(!expandTexts?5:textsReform.length)).map((text) => <SubTextsTable data={text} key={text.book} name = {props.name}/>)}
        {textsReform&&textsReform.length>5&&
            <button onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(textsReform.length-5) + " texts"}</button>}
    </div>)
}

const SubTextsTable = (props) => {
    const {bookLabel, publYear,dopYear, inceptionYear, book} = props.data
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <div className="text-info">
            <p><a href={book}>{bookLabel}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}</a>
                <button onClick = {() => {setDetailed(!detailed)}}>
                    {detailed?"Collapse":"Expand"}
                    </button>
            </p>
            {detailed
            ?<>
                <DetailedTexts data = {props.data} name={props.name}/>
                {detailed&&<ArchiveList title={bookLabel} name={props.name}/>}
            </>
            :<></>}

        </div>
    )
}

export const ArchiveList = (props) => {
    const [archive, setArchive] = useState();
    const [showArchive, setShowArchive] = useState(false)
    const {title, name} = props
    useEffect(() => {archiveEffect({title, name, setArchive})();},[])
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
        ,dopYear, inception, inceptionYear, metreLabel, book, publisherLabel} = props.data
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <>
            {titleLabel&&<p><span style = {{"fontWeight": 600,}}>Original Title </span>{titleLabel}</p>}
            {selectedDate&&<p><span style = {{"fontWeight": 600,}}>Written </span>{transformYear(selectedDate)}</p>}
            {languageLabel&&<p><span style = {{"fontWeight": 600,}}>Language </span>{languageLabel}</p>}
            {genreLabel&&<p><span style = {{"fontWeight": 600,}}>Genre </span>{genreLabel}</p>}
            {typeLabel&&<p><span style = {{"fontWeight": 600,}}>Type </span>{typeLabel}</p>}
            {metreLabel&&<p><span style = {{"fontWeight": 600,}}>Metre </span>{metreLabel}</p>}
            {publisherLabel&&<p><span style = {{"fontWeight": 600,}}>Publishers </span>{publisherLabel}</p>}
        </>
    )
}

export default AuthorTable;