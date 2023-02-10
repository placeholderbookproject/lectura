import {Link} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'
import {useState, useEffect} from 'react'

const TextTable = (props) => {
    const text = props.data;
    const [data, setData] = useState(text);
    const [edit, setEdit] = useState(false);
    const title = data.title.split(",");
    const numTitles = title.length;
    const textLabels = labels;
    useEffect(() => {
        setData(props.data)
    },[props.data])
    const setEditWindow = () => {
        if (!edit) {setEdit(true)}
        else{setEdit(false)}
    }
    const uploadEdits = () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data)
        };
        fetch('http://127.0.0.1:8000/edit?type=texts&id='+data.id, requestOptions)
            .then(response => response.json())
            .finally(() => setEdit(false))
    }
    const editInfo = (e) => {
        const {value, name} = e.target
        let newData = data
        newData[name] = value
        setData({...data,[name]:value})
    }
    return (
      (
        <div>
        <button onClick = {setEditWindow}>{!edit?textLabels.editBtn:textLabels.exitEditBtn}</button>
        {edit?
            <>
                <button onClick = {() => setData(props.data)}>{textLabels.undoEditBtn}</button>
                <button onClick = {uploadEdits}>{textLabels.submit_edits}</button>
            </>
            :<></>}
            <table id = "textTableWindow"><tbody>
                <tr>
                    <th className = "Header">{title[0]}</th>
                </tr>
                <tr>
                    <td>{(numTitles>1)?textLabels.aka + title.slice(1,numTitles).join(", "):""}</td>{/*akas, a string of alternative names. Should be replaced with a list of language alternatives*/}
                </tr>
                <TableRow label = {textLabels.author_name + " "} >
                    {data.author_id !== ""?
                        <Link to = {"/author/"+data.author_id}>
                            {data.author}
                        </Link>:
                        <>{data.author}</>
                    }
                </TableRow>
                {!edit?
                    (data.language !== "")?<TableRow label = {textLabels.original_language}>{data.language}</TableRow>:<></>
                    :<TableRow label = {textLabels.original_language}>
                        <input value = {data.language} name = "language" onChange = {e => editInfo(e)}></input>
                    </TableRow>
                    }
                {<TableRow label = {textLabels.original_publication_date + " "}>
                    {!edit?
                    (data.publication>0)?data.publication + " AD": data.publication !== ""? Math.abs(data.publication) + " BC": textLabels.unspecified
                    :<input type="number" value = {data.publication} name = "publication" onChange = {e => editInfo(e)}></input>
                     }
                </TableRow>
                }
                {data.publisher !== "" | edit?
                    <TableRow label = {textLabels.original_publisher_name + " "}>
                    {!edit?
                        (data.publisher !== ""?data.publisher:textLabels.unspecified) + (data.publication_loc !== ""? " (" + data.publication_loc + ")":"")
                        :<>
                            <label>
                                <input value = {data.publisher} name = "publisher" onChange = {e=>editInfo(e)}></input>
                            </label>
                            <label>(
                                <input value = {data.publication_loc} name = "publication_loc" onChange = {e=>editInfo(e)}></input>)
                            </label>
                        </>
                        }
                </TableRow>
                :<></>}
                {data.publication_type !== ""| edit? 
                    <TableRow label = {textLabels.original_publication_type + " "}>
                        {!edit?
                            data.publication_type
                            :<input value={data.publication_type} name = "publication_type" onChange = {e => editInfo(e)}></input>
                        }
                    </TableRow>
                :<></>}
                {data.publication_length !== ""|edit?
                <TableRow label = {textLabels.original_publication_length + " "}>
                    {!edit
                        ?data.publication_length + data.publication_length_type !== ""? " (" + data.publication_length_type + ")":""
                        :<><label>
                            <input type = "number" value={data.publication_length} name="publication_length" onChange = {e => editInfo(e)}></input>(
                            <input value={data.publication_length_type} name = "publication_length_type"
                                onChange = {e => editInfo(e)}></input>)
                        </label></>
                    }
                </TableRow>:<></>}
                {/*genre placeholder*/}
                {/*type placeholder*/}
                {(data.writing_start !== "" && data.writing_end !== "")|edit? 
                    <TableRow label = {textLabels.writing_period + " "}>
                        {!edit?
                            data.writing_start + "-" + data.writing_end
                            :<>
                                <label>
                                <input type = "number" value={data.writing_start} name = "writing_start" onChange = {e => editInfo(e)}></input>
                                -
                                <input type = "number" value={data.writing_end} name = "writing_end" onChange = {e => editInfo(e)}></input>
                                </label>
                            </>
                            }
                    </TableRow>:<></>
                    }
                <tr className = {"Editions"} style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
                    <td>{textLabels.editions}</td>
                </tr>
                {data.editions.length>0?data.editions.map((edition) => 
                        <TableRow key = {edition.index}>
                            {<Link to = {"/text/"+data.id+"/edition/"+edition.index}>{edition.title}</Link>}
                            {edition.publication_year !== undefined?" (" + edition.publication_year + ") ":""}
                            {edition.additional_authors !== undefined? " (editors: " + edition.additional_authors + ")":""}
                            {edition.language !== null ? " (" + edition.language + ")":""}
                            {edition.ISBN13!==undefined|edition.ISBN!==undefined?" (ISBN: " + edition.ISBN + "/ "+edition.ISBN13+ ")":")"}
                            
                        </TableRow>//<EditionRow data={edition} key = {edition.title}/>
                        ):<></>}{/*Will contains a list of editions -> edition view (work/edition/id)
                    Edition title, date of publication, editor name, language, ISBN (if exists)
                    */}       
            </tbody></table>
        </div>

      )
    )
  }

  export default TextTable;