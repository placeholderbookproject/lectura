import {Link} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'
import {useState, useEffect} from 'react';
import Select from 'react-select';

const TextTable = (props) => {
    const text = props.data;
    const [data, setData] = useState(text);
    const [edit, setEdit] = useState(false);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState();
    const title = data.text_title.split(",");
    const numTitles = title.length;
    useEffect(() => {
        setData(props.data)
    },[props.data])
    useEffect (()=> {
        const fetchData = () => {
          const requestOptions = {
              method: 'GET',
                      };
          fetch('http://127.0.0.1:8000/search?query='+query+"&type=authors", requestOptions)
          .then(response => {
              if (response.ok) {
              return response.json()
              }
              throw response;
          })
          .then (data => {setSearchResults(data["authors"])
          })
        }
      query.length>3?fetchData():void(0);
      },[query])  

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
        {edit?
            <>
                <button className = "submitEditBtn" onClick = {uploadEdits}>{labels.submit_edits}</button>
            </>
            :<></>}
            <table id = "textTableWindow"><tbody>
                <tr>
                    <th className = "Header">{title[0]}</th>
                </tr>
                <tr>
                    <td>{(numTitles>1)?labels.aka + title.slice(1,numTitles).join(", "):""}</td>{/*akas, a string of alternative names. Should be replaced with a list of language alternatives*/}
                </tr>
                <TableRow label = {labels.author_name + " "} >
                    {edit?
                        <div style = {{display:'inline-flex'}}>
                        <Select 
                            placeholder={data.text_author?data.text_author:"find an author in the system"}
                            options = {typeof searchResults === 'object'?(searchResults):void(0)}
                            onInputChange = {selectQuery}
                            onChange = {searchSelect}
                            getOptionLabel = {(option) => option.name.split(", ")[0] + (option.birth!=="" && option.death !== "" //Need to change after API is adjusted.
                                                                                ?(" (" + option.birth + "-" + option.death + ")")
                                                                                :(" (fl. "+option.floruit + ")"))                                             
                                                }
                        />
                        </div>
                        :data.author_id !== null
                            ?<Link to = {"/author/"+data.author_id}>
                                {data.text_author}
                            </Link>
                            :<>{data.text_author}</>
                    }
                </TableRow>
                {!edit?
                    (data.text_language !== null)?<TableRow label = {labels.original_language}>{data.text_language}</TableRow>:<></>
                    :<TableRow label = {labels.original_language}>
                        <input value = {data.text_language} name = "text_language" onChange = {e => editInfo(e)}></input>
                    </TableRow>
                    }
                {<TableRow label = {labels.original_publication_date + " "}>
                    {!edit?
                    (data.text_original_publication_year>0)
                        ?data.text_original_publication_year + " AD"
                        : data.text_original_publication_year !== null
                            ? Math.abs(data.text_original_publication_year) + " BC"
                            : labels.unspecified
                    :<input type="number" value = {data.text_original_publication_year} name = "text_original_publication_year" onChange = {e => editInfo(e)}></input>
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
                                <input value = {data.text_original_publication_publisher} name = "text_original_publication_publisher" onChange = {e=>editInfo(e)}></input>
                            </label>
                            <label>(
                                <input value = {data.text_original_publication_publisher_loc} name = "text_original_publication_publisher_loc" onChange = {e=>editInfo(e)}></input>)
                            </label>
                        </>
                        }
                </TableRow>
                :<></>}
                {data.text_original_publication_type !== null| edit? 
                    <TableRow label = {labels.original_publication_type + " "}>
                        {!edit?
                            data.text_original_publication_type
                            :<input value={data.text_original_publication_type} name = "text_original_publication_type" onChange = {e => editInfo(e)}></input>
                        }
                    </TableRow>
                :<></>}
                {data.text_original_publication_length !== null|edit?
                <TableRow label = {labels.original_publication_length + " "}>
                    {!edit
                        ?data.text_original_publication_length + data.text_original_publication_length_type !== ""? " (" + data.text_original_publication_length_type + ")":""
                        :<><label>
                            <input type = "number" value={data.text_original_publication_length} name="text_original_publication_length" onChange = {e => editInfo(e)}></input>(
                            <input value={data.text_original_publication_length_type} name = "text_original_publication_length_type"
                                onChange = {e => editInfo(e)}></input>)
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
                                <input type = "number" value={data.writing_start} name = "text_writing_start" onChange = {e => editInfo(e)}></input>
                                -
                                <input type = "number" value={data.writing_end} name = "text_writing_end" onChange = {e => editInfo(e)}></input>
                                </label>
                            </>
                            }
                    </TableRow>:<></>
                    }
                <tr className = {"Editions"} style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
                    <td>{labels.editions}</td>
                </tr>
                {/*data.editions.length>0?data.editions.map((edition) => 
                        <TableRow key = {edition.index}>
                            {<Link to = {"/text/"+data.id+"/edition/"+edition.index}>{edition.title}</Link>}
                            {edition.publication_year !== undefined?" (" + edition.publication_year + ") ":""}
                            {edition.additional_authors !== undefined? " (editors: " + edition.additional_authors + ")":""}
                            {edition.language !== null ? " (" + edition.language + ")":""}
                            {edition.ISBN13!==undefined|edition.ISBN!==undefined?" (ISBN: " + edition.ISBN + "/ "+edition.ISBN13+ ")":")"}
                            
                        </TableRow>//<EditionRow data={edition} key = {edition.title}/>
                        ):<></>*/}{/*Will contains a list of editions -> edition view (work/edition/id)
                    Edition title, date of publication, editor name, language, ISBN (if exists)
                    */}       
            </tbody></table>
        </div>

      )
    )
  }

  export default TextTable;