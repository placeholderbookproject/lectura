import React, {/*useRef,*/ useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import TableRow from './ViewRow.js';
import labels from './labels.js';
import AuthorTexts from './AuthorTexts.js';
import {searchWikipediaEffect, fetchComments, fetchDataEffect, wikidataEffect} from './apiEffects.js';
import {checkStr, transformYear} from './formattingFuncs.js';
import {AuthorEdit} from './EditWindow.js';
import {editRowAll} from './filters.js';
import { Comment } from './Comments.js';
import { wikiTranslations } from './filters.js';
const parse = require('html-react-parser');

const AuthorTable = (props) => {
    const [wiki, setWiki] = useState("");
    const [wikidata, setWikidata] = useState();
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
    useEffect(() => 
        {
           const author_q = data&&(data.author_q!==undefined)?data.author_q.replace("http://www.wikidata.org/entity/",""):null; 
            author_q?wikidataEffect({q_number:author_q, setWikidata})():console.log("no author_q");
        }
        ,[data])
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
        <div>
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
                {/*wikidata?reformatWikidata(wikidata):null*/}
            </tbody></table>
            {wikidata?<AuthorWikiTable data = {wikidata}/>:<></>}
            </div>
    );
  }

const AuthorWikiTable = (props) => {
    const reformatWikidata = (wiki) => {
        const columns = wiki.head.vars;
        let reformData = {};
        for (let i = 0; i<columns.length; i++) {
            let col = columns[i], dataPoint = "";
            const resultLength = wiki.results.bindings.length
            for (let j = 0;j<resultLength;j++){
                const row = wiki.results.bindings[j]
                if (Object.keys(row).includes(col)){
                    const val = row[col].value;
                    if(val===undefined) {continue}
                    else if (j ===0){dataPoint = dataPoint+val}
                    else if (!dataPoint.includes(val)&&j!==resultLength) {dataPoint = dataPoint + ", " + val }
                    else if (!dataPoint.includes(val)&&j===resultLength){dataPoint = dataPoint + ", " + val}
                } else {dataPoint = null}
            }
            reformData[col] = dataPoint;
        } return reformData
    };
    const data = reformatWikidata(props.data);
    const transl = wikiTranslations;
    return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data).map((item) => (
                <tr key={item}>
                  <td>{transl[item]}</td>
                  <td>{data[item]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
};

export default AuthorTable;