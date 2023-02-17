import {Link} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'
import {useState, useEffect} from 'react';
import Select from 'react-select';
import {transformYear} from './formattingFuncs';
import {fetchSearchResults, submitEdits, fetchDataEffect} from './apiEffects'
import EditWindow from './EditWindow.js';

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
    const [editData, setEditData] = useState({'text_id':props.text.text_id});
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState();
    const title = data.text_title.split(",");
    const numTitles = title.length;
    useEffect(() => {setData(props.text)},[props.text])
    useEffect (fetchSearchResults({query, setSearchResults, type: "authors"}),[query])  
    const setEditWindow = () => {
        if (!edit) {setEdit(true)}
        else{setEdit(false)}
    }
    const editInfo = (e) => {
        const {value, name} = e.target
        const oldEdit = editData;
        let newData = data
        newData[name] = value
        setEditData({...oldEdit, [name]:value})
        setData({...data,[name]:value})
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
    const resetEdit = () => {
        setData(props.text)
        setEditData({'text_id':props.text.text_id})
    }
    return (
      (
        <div>
            <EditWindow id={props.text.text_id} editData = {editData} setEdit = {setEdit} setEditWindow = {setEditWindow}
                resetEdit = {resetEdit} data = {props.text} edit = {edit} type = "texts" submitEdits = {submitEdits}/>        
            <table id = "textTableWindow"><tbody>
                <tr>
                    <th className = "Header">{title[0]}</th>
                </tr>
                <tr>
                    <td>{(numTitles>1)?labels.aka + title.slice(1,numTitles).join(", "):""}</td>{/*akas, a string of alternative names. Should be replaced with a list of language alternatives*/}
                </tr>
                <TableRow label = {labels.author_name + " "} >
                    {edit
                        ?<div style = {{display:'inline-flex'}}>
                            <Select 
                                placeholder={data.text_author?data.text_author:"find an author in the system"}
                                options = {typeof searchResults === 'object'?(searchResults):void(0)}
                                onInputChange = {selectQuery}
                                onChange = {searchSelect}
                                getOptionValue = {(option) => option.author_id}
                            />
                        </div>
                        :data.author_id !== null
                            ?<Link to = {"/author/"+data.author_id}>{data.text_author}</Link>
                            :<>{data.text_author}</>
                    }
                </TableRow>
                {!edit?
                    (data.text_language !== null)?<TableRow label = {labels.original_language}>{data.text_language}</TableRow>:<></>
                    :<TableRow label = {labels.original_language}>
                        <input value = {data.text_language===null?"":data.text_language} name = "text_language" 
                            onChange = {e => editInfo(e)}></input>
                    </TableRow>
                    }
                {<TableRow label = {labels.original_publication_date + " "}>
                    {!edit
                        ?transformYear(data.text_original_publication_year, labels.unspecified)
                        :<input type="number" value = {data.text_original_publication_year===null?"":data.text_original_publication_year} 
                            name = "text_original_publication_year" onChange = {e => editInfo(e)}/>
                     }
                </TableRow>
                }
                {data.text_original_publication_publisher !== null | edit?
                    <TableRow label = {labels.original_publisher_name + " "}>
                    {!edit?
                        (data.text_original_publication_publisher !== null
                            ?data.text_original_publication_publisher
                            :labels.unspecified) + 
                                (data.text_original_publication_publisher_loc !== null? " (" + data.text_original_publication_publisher_loc + ")":"")
                        :<>
                            <label>
                                <input value = {data.text_original_publication_publisher===null?"":data.text_original_publication_publisher} 
                                    name = "text_original_publication_publisher" onChange = {e=>editInfo(e)}/>
                            </label>
                            <label>(
                                <input value = {data.text_original_publication_publisher_loc===null?"":data.text_original_publication_publisher_loc} 
                                    name = "text_original_publication_publisher_loc" onChange = {e=>editInfo(e)}/>)
                            </label>
                        </>
                        }
                </TableRow>
                :<></>}
                {data.text_original_publication_type !== null| edit? 
                    <TableRow label = {labels.original_publication_type + " "}>
                        {!edit?
                            data.text_original_publication_type
                            :<input value={data.text_original_publication_type===null?"":data.text_original_publication_type} 
                                name = "text_original_publication_type" onChange = {e => editInfo(e)}/>
                        }
                    </TableRow>
                :<></>}
                {data.text_original_publication_length !== null|edit?
                <TableRow label = {labels.original_publication_length + " "}>
                    {!edit
                        ?data.text_original_publication_length + data.text_original_publication_length_type !== ""? " (" + data.text_original_publication_length_type + ")":""
                        :<><label>
                            <input type = "number" value={data.text_original_publication_length===null?"":data.text_original_publication_length} 
                                name="text_original_publication_length" onChange = {e => editInfo(e)}/>(
                            <input value={data.text_original_publication_length_type===null?"":data.text_original_publication_length_type} 
                                name = "text_original_publication_length_type" onChange = {e => editInfo(e)}/>)
                        </label></>
                    }
                </TableRow>:<></>}
                {/*genre placeholder*/}
                {/*type placeholder*/}
                {(data.text_writing_start !== null && data.text_writing_end !== null)|edit? 
                    <TableRow label = {labels.writing_period + " "}>
                        {!edit?
                            data.text_writing_start + "-" + data.text_writing_end
                            :<>
                                <label>
                                <input type = "number" value={data.writing_start===null?"":data.writing_start} 
                                    name = "text_writing_start" onChange = {e => editInfo(e)}/>
                                -
                                <input type = "number" value={data.writing_end===null?"":data.writing_end} 
                                    name = "text_writing_end" onChange = {e => editInfo(e)}/>
                                </label>
                            </>
                            }
                    </TableRow>:<></>
                    }
                <TextEditionsTable text_id = {props.text.text_id} />
            </tbody></table>
        </div>

      )
    )
  }

  export default TextTable;