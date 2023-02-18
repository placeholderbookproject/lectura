import TableRow from './ViewRow.js';
import {Link} from 'react-router-dom';
import labels from './labels.js';
import {useState} from 'react'
import EditWindow from './EditWindow.js';
import {editRowAll} from './filters.js';

const EditionTable = (props) => {
    const [data, setData] = useState(props.edition);
    const {text_id, edition_title, text_author, text_title, edition_editor, edition_isbn, edition_isbn13
        , edition_publisher, edition_binding, edition_length, edition_publication_year, edition_language} = data
    const editRowData = editRowAll["editions"]
    const [edit, setEdit] = useState(false)
    const setEditWindow = () => {!edit?setEdit(true):setEdit(false)}
    return (
    <div>
        <button className = "editBtn" onClick = {setEditWindow}>{!edit?labels.editBtn:labels.exitEditBtn}</button>
        <table id = "editionTableWindow"><tbody>
            <tr><th className = "Header">{edition_title}{edition_language!== null?" (" + edition_language + ")":""}</th></tr>
            {!edit
                ?<>
                    <TableRow label = {labels.original_title + " "}><Link to={"/text/"+text_id}>{text_title}</Link></TableRow>
                    <TableRow label = {labels.author + " "}>{text_author}{edition_editor!==null?" (editors: " + edition_editor + ")":""}</TableRow>
                    <TableRow label = {labels.publication + " "}>{edition_publication_year}{" (" + edition_publisher + ")"}</TableRow>
                    <TableRow label = {labels.length + " "}>
                        {edition_length + " " + labels.pages + " (" +edition_binding + ")"}
                    </TableRow>
                    <TableRow label = {labels.isbn + " "}>
                        {edition_isbn + "/ " + edition_isbn13}
                    </TableRow>
                </>
                :<EditWindow cols = {editRowData} data = {data} origData = {props.edition} setData = {setData}
                    setEdit = {setEdit} type = "editions" id = {props.edition.edition_id}/>
            }   
        </tbody></table>
    </div>
    )
}

export default EditionTable;