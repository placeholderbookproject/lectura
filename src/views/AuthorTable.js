import React, {/*useRef,*/ useState, useEffect} from 'react';
import TableRow from './ViewRow.js';
import labels from './labels.js';
import AuthorTexts from './AuthorTexts.js';
import {searchWikipediaEffect} from './apiEffects.js';
import {checkStr, transformYear} from './formattingFuncs.js';
import {AuthorEdit} from './EditWindow.js';
import {editRowAll} from './filters.js';
const parse = require('html-react-parser');

const AuthorTable = (props) => {
    const [wiki, setWiki] = useState("");
    const [data, setData] = useState(props.author);
    const [edit, setEdit] = useState(false);
    const editRowData = editRowAll["authors"];
    const name = data.author_name.split(",");
    const numNames = name.length;
    const occupationList = data.author_positions.split(", ");
    const mainOccupation = occupationList[0];
    useEffect(() => {setData(props.author)},[props.author])
    useEffect (searchWikipediaEffect({setWiki, edit, name:name[0], mainOccupation}),[name,mainOccupation, edit, props.author.author_id])
    const setEditWindow = () => {!edit?setEdit(true):setEdit(false)}
    return (
        <table id = "authorTableWindow"><tbody>
            <tr className = "Header">
                <th>{name[0]}
                    <button className = "editBtn" onClick = {setEditWindow} style = {{border:'None'}}>{/*!edit?labels.editBtn:labels.exitEditBtn*/}
                        <img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg" alt = "edit" width="25" height="30"/>
                    </button>
                </th>
            </tr>
            <tr><td>{numNames>1?labels.aka + name.slice(1,numNames).join(", "):<></>}</td></tr>
            {!edit
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
                </>
                :<AuthorEdit cols = {editRowData} data = {data} origData = {props.author} setData = {setData}
                    type = "authors" id = {props.author.author_id}/>
            }
                <AuthorTexts edit = {edit} author_id = {data.author_id}/>
            </tbody></table>
    );
  }

  export default AuthorTable;