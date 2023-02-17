import TableRow from './ViewRow.js';
import {Link} from 'react-router-dom';
import labels from './labels.js';

const EditionTable = (props) => {
    const data = props.edition;
    const editionLabels = labels;
    const {text_id, edition_title, text_author, text_title, edition_editor, edition_isbn, edition_isbn13
        , edition_publisher, edition_binding, edition_length, edition_publication_year, edition_language} = data
    return (
        <table id = "editionTableWindow"><tbody>
            <tr><th className = "Header">{edition_title}{edition_language!== null?" (" + edition_language + ")":""}</th></tr>
            <TableRow label = {editionLabels.original_title + " "}><Link to={"/text/"+text_id}>{text_title}</Link></TableRow>
            <TableRow label = {editionLabels.author + " "}>{text_author}{edition_editor!==null?" (editors: " + edition_editor + ")":""}</TableRow>
            <TableRow label = {editionLabels.publication + " "}>{edition_publication_year}{" (" + edition_publisher + ")"}</TableRow>
            <TableRow label = {editionLabels.length + " "}>
            {edition_length + " " + editionLabels.pages + " (" +edition_binding + ")"}
            </TableRow>
            <TableRow label = {editionLabels.isbn + " "}>
                {edition_isbn + "/ " + edition_isbn13}
            </TableRow>        
        </tbody></table>
    )
}

export default EditionTable;