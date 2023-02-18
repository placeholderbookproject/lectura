import {Link} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'
import {useState, useEffect} from 'react';
import Select from 'react-select';
import {transformYear} from './formattingFuncs';
import {fetchSearchResults, fetchDataEffect} from './apiEffects'
import EditWindow from './EditWindow.js';
import {editRowAll} from './filters.js';

const TextEditionsTable = (props) => {
    const [editionsData, setEditionsData] = useState([]);
    useEffect (fetchDataEffect({setData:setEditionsData, id:props.text_id, type:'editions'}),[props.text_id])
    return (
        <>
            <tr className = "Editions" style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
                <td>{labels.editions}</td>
            </tr>
                {editionsData.length>0?editionsData.map((edition) => 
                        <TableRow key = {edition.edition_id}>
                            {<Link to = {"/text/"+props.text_id+"/edition/"+edition.edition_id}>{edition.edition_title}</Link>}
                            {edition.label}
                        </TableRow>
                        ):<></>}
        </>
    )
}

const TextTable = (props) => {
    const [data, setData] = useState(props.text);
    const [edit, setEdit] = useState(false);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState();
    const editRowData = editRowAll["texts"];
    const title = data.text_title.split(",");
    const numTitles = title.length;
    useEffect(() => {setData(props.text)},[props.text])
    useEffect (fetchSearchResults({query, setSearchResults, type: "authors"}),[query])  
    const setEditWindow = () => {
        if (!edit) {setEdit(true)}
        else{setEdit(false)}
    }
    const selectQuery = (event) => {
        const query = event;
        if (query.length>3){setQuery(query);}
      }
    const searchSelect = (event) => {
        let newData = data;
        newData["author_name"] = event.name
        newData["author_id"] = event.id
        setData(newData);
    }
    return (
      (
        <div>
            <button className = "editBtn" onClick = {setEditWindow}>{!edit?labels.editBtn:labels.exitEditBtn}</button>
            <table id = "textTableWindow"><tbody>
                <tr>
                    <th className = "Header">{title[0]}</th>
                </tr>
                <tr>
                    <td>{(numTitles>1)?labels.aka + title.slice(1,numTitles).join(", "):""}</td>{/*akas, a string of alternative names. Should be replaced with a list of language alternatives*/}
                </tr>
                {!edit?
                <>
                    <TableRow label = {labels.author_name + " "} >
                        {data.author_id !== null
                            ?<Link to = {"/author/"+data.author_id}>{data.text_author}</Link>
                            :<>{data.text_author}</>}
                    </TableRow>
                        {(data.text_language !== null)?<TableRow label = {labels.original_language}>{data.text_language}</TableRow>:<></>}
                    <TableRow label = {labels.original_publication_date + " "}>
                        {transformYear(data.text_original_publication_year, labels.unspecified)}
                    </TableRow>
                    {data.text_original_publication_publisher !== null
                        ?<TableRow label = {labels.original_publisher_name + " "}>
                        {(data.text_original_publication_publisher !== null
                                ?data.text_original_publication_publisher
                                :labels.unspecified) + 
                                    (data.text_original_publication_publisher_loc !== null? " (" + data.text_original_publication_publisher_loc + ")":"")
                            }
                        </TableRow>
                        :<></>}
                    {data.text_original_publication_type !== null
                        ?<TableRow label = {labels.original_publication_type + " "}> {data.text_original_publication_type}</TableRow>
                        :<></>}
                    {data.text_original_publication_length !== null
                        ?<TableRow label = {labels.original_publication_length + " "}>
                            {data.text_original_publication_length + data.text_original_publication_length_type !== ""
                                ?" (" + data.text_original_publication_length_type + ")":""}
                        </TableRow>
                        :<></>}
                    {/*genre placeholder*/}
                    {/*type placeholder*/}
                    {(data.text_writing_start !== null && data.text_writing_end !== null) 
                        ?<TableRow label = {labels.writing_period + " "}>
                            {data.text_writing_start + "-" + data.text_writing_end}
                        </TableRow>
                        :<></>
                        }
                </>
                :<>
                    <TableRow label = {labels.author_name + " "}>
                        <div style = {{display:'inline-flex'}}>
                                        <Select 
                                            placeholder={data.text_author?data.text_author:"find an author in the system"}
                                            options = {typeof searchResults === 'object'?(searchResults):void(0)}
                                            onInputChange = {selectQuery}
                                            onChange = {searchSelect}
                                            getOptionValue = {(option) => option.author_id}
                                        />
                        </div>
                    </TableRow>
                    <EditWindow cols = {editRowData} data = {data} origData = {props.text} setData = {setData}
                        setEdit = {setEdit} type = "texts" id = {props.text.text_id}/>
                </>
                }
                <TextEditionsTable text_id = {props.text.text_id} />
            </tbody></table>
        </div>

      )
    )
  }

  export default TextTable;