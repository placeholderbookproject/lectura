import {Link,useParams} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'
import {useState, useEffect} from 'react';
import {transformYear} from './formattingFuncs';
import {fetchDataEffect} from './apiEffects'
import {TextEdit} from './EditWindow.js';
import {editRowAll} from './filters.js';

const TextEditionsTable = (props) => {
    const [editionsData, setEditionsData] = useState([]);
    useEffect (fetchDataEffect({setData:setEditionsData, id:props.text_id, type:'editions'}),[props.text_id])
    return (
        <>
            <tr className = "Editions" style = {{textDecoration: 'underline 1px'}}><td>{labels.editions}</td></tr>
                {editionsData.length>0
                    ?editionsData.map((edition) => 
                        <TableRow key = {edition.edition_id}>
                            {<Link to = {"/text/"+props.text_id+"/edition/"+edition.edition_id}>{edition.edition_title}</Link>}
                            {edition.label}
                        </TableRow>)
                    :<></>}
        </>
    )
}

const TextTable = (props) => {
    const [data, setData] = useState();
    const [edit, setEdit] = useState(false);
    const { id } = useParams();
    const editRowData = editRowAll["texts"];
    const title = data&&data.text_title?data.text_title.split(","):"";
    const numTitles = title.length!==undefined?title.length:"";
    useEffect(fetchDataEffect({type:'texts', id:id, setData:setData}) , [id]);
    useEffect(() => {setData(id)},[id])
    const setEditWindow = () => {!edit?setEdit(true):setEdit(false)}
    return (
        <div id = "textTableWindow" className="person-info">
                <h2 className = "Header">{title[0]}
                <button className = "editBtn" onClick = {setEditWindow} style = {{border:'None'}}>{/*!edit?labels.editBtn:labels.exitEditBtn*/}
                    <img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg" alt = "edit" width="25" height="30"/>
                </button>
                </h2>
            <p>{(numTitles>1)?labels.aka + title.slice(1,numTitles).join(", "):""}</p>
            {!edit&&data
            ?<>
                <TableRow label = {labels.author_name + " "} >
                    {data.author_id !== null
                        ?<Link to = {"/author/"+data.author_id}>{data.text_author}</Link>
                        :<>{data.text_author}</>}
                </TableRow>
                    {(data.text_language !== null)?<TableRow label = {labels.original_language + " "}>{data.text_language}</TableRow>:<></>}
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
                        {data.text_original_publication_length + (data.text_original_publication_length_type !== ""
                            ?" " + data.text_original_publication_length_type + "":"")}
                    </TableRow>
                    :<></>}
                {(data.text_writing_start !== null && data.text_writing_end !== null) 
                    ?<TableRow label = {labels.writing_period + " "}>
                        {data.text_writing_start===data.text_writing_end
                            ?data.text_writing_start
                            :data.text_writing_start + "-" + data.text_writing_end}
                    </TableRow>
                    :<></>
                    }
                    <TableRow label = {labels.text_q + " "}>
                        <a href={data.text_q}>{data.text_q&&data.text_q.replace("http://www.wikidata.org/entity/","")}</a>
                    </TableRow>
                    <TableRow label = {labels.text_author_q + " "}>
                        {data.text_author_q?data.text_author_q.split(", ").map((author) => 
                            <a href={author}>{author.replace("http://www.wikidata.org/entity/","")+" "}</a>
                        ):<></>}
                    </TableRow>
            </>
            :<></>}
            {edit?<>
                <TextEdit cols = {editRowData} data = {data} origData = {props.text} setData = {setData}
                    type = "texts" id = {props.text} />
            </>
            :<></>
            }
            {/*<TextEditionsTable text_id = {props.text} />*/}
        </div>
    )
  }

  export default TextTable;