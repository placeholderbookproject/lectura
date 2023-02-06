import TableRow from './ViewRow.js'
import {Link} from 'react-router-dom'

const labels = {
    author : 'Author',
    original_title : 'Original Title',
    language : 'Language',
    editors : 'Editors',
    isbn : 'ISBN10/13',
    publisher : 'Publisher',
    binding : 'Binding',
    pages : 'pages',
    publication : 'Published',
    length : 'Length',
}

const EditionTable = (props) => {
    const data = props.data;
    const editionLabels = labels;
    const {text_index, title, original_title, author, additional_authors, isbn, isbn13
        , publisher, binding, number_of_pages, publication_year, language} = data
    return (
        <table id = "editionTableWindow"><tbody>
            <tr><th className = "Header">{title}{language!== null?" (" + language + ")":""}</th></tr>
            <TableRow label = {editionLabels.original_title + " "}><Link to={"/text/"+text_index}>{original_title}</Link></TableRow>
            <TableRow label = {editionLabels.author + " "}>{author}{additional_authors!==undefined?" (editors: " + additional_authors + ")":""}</TableRow>
            <TableRow label = {editionLabels.publication + " "}>{publication_year}{" (" + publisher + ")"}</TableRow>
            <TableRow label = {editionLabels.length + " "}>
            {number_of_pages + " " + editionLabels.pages}
            {" (" +binding + ")"}
            </TableRow>
            <TableRow label = {editionLabels.isbn + " "}>
                {isbn + "/ " + isbn13}
            </TableRow>        
        </tbody></table>
    )
}

export default EditionTable;