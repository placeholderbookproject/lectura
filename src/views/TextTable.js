import {Link} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'

const TextTable = (props) => {
    const text = props.data;
    const title = text.title.split(",");
    const numTitles = title.length;
    const author = text.author;
    const textLabels = labels;
    const [language, publisher, /*genre, type,*/ publication_type, publication_length, publication_length_type, publication_loc
        , writing_start, writing_end] = ""
    return (
      (
        <table id = "textTableWindow"><tbody>
            <tr>
                <th className = "Header">
                    {title[0]}{/*Text title: currently just the first title name*/}
                </th>
            </tr>
            <tr>
                <td>{(numTitles>1)?textLabels.aka + title.slice(1,numTitles).join(", "):""}</td>{/*akas, a string of alternative names. Should be replaced with a list of language alternatives*/}
            </tr>
            <TableRow label = {textLabels.author_name + " "} >
                {text.author_id !== ""?
                    <Link to = {"/author/"+text.author_id}>
                        {author}
                    </Link>:
                    <>{author}</>
                }
            </TableRow>
            {(language !== undefined)?<TableRow label = {textLabels.original_language}>{language}</TableRow>:<></>}
            <TableRow label = {textLabels.original_publication_date + " "}>
                {(text.publication>0)?text.publication + " AD": text.publication !== ""? Math.abs(text.publication) + " BC": textLabels.unspecified }
            </TableRow>
            {(publisher !== undefined)?//Publisher name & location
                        <TableRow label = {textLabels.original_publisher_name}>
                        {publisher + publication_loc !== undefined? " (" + publication_loc + ")":""}
                        </TableRow>:<></>}
            {publication_type !== undefined?<TableRow label = {textLabels.original_publication_type}>{publication_type}</TableRow>:<></>}
            {publication_length !== undefined?
            <TableRow label = {textLabels.publication_length}>
                {publication_length + publication_length_type !== undefined? " (" + publication_length_type + ")":""}
            </TableRow>:<></>}
            {/*genre placeholder*/}
            {/*type placeholder*/}
            {writing_start !== undefined && writing_end !== undefined? 
                <TableRow label = {textLabels.writing_period}>
                    {writing_start + "-" + writing_end}
                </TableRow>:<></>
                }
            <tr className = {"Editions"} style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
                <td>{textLabels.editions}</td>
            </tr>
            {text.editions.length>0?text.editions.map((edition) => 
                    <TableRow key = {edition.index}>
                        {<Link to = {"/text/"+text.id+"/edition/"+edition.index}>{edition.title}</Link>}
                        {edition.publication_year !== undefined?" (" + edition.publication_year + ") ":""}
                        {edition.additional_authors !== undefined? " (editors: " + edition.additional_authors + ")":""}
                        {edition.language !== null ? " (" + edition.language + ")":""}
                        {edition.ISBN13!==undefined|edition.ISBN!==undefined?" (ISBN: " + edition.ISBN + "/ "+edition.ISBN13+ ")":")"}
                        
                    </TableRow>//<EditionRow data={edition} key = {edition.title}/>
                    ):<></>}{/*Will contains a list of editions -> edition view (work/edition/id)
                Edition title, date of publication, editor name, language, ISBN (if exists)
                */}       
        </tbody></table>

      )
    )
  }

  export default TextTable;