import labels from './labels.js';
import {submitEdits, fetchSearchResults, uploadNew} from './apiEffects.js';
import Select from 'react-select';
import CreateableSelect from 'react-select/creatable';
import TableRow from './ViewRow.js';
import {useState, useEffect} from 'react'
import TextareaAutosize from 'react-textarea-autosize';

export const InputWithLabel = (props) => {
    const {editData, setEditData, data, setData, type, label, value, name} = props
    const editInfo = (e) => {
        const {value, name} = e.target
        const oldEdit = editData
        let newData = data
        newData[name] = value
        setEditData({...oldEdit, [name]:value})
        setData({...data,[name]:value})
    }
    return (
        <div className="input-group" style = {{display:'inline-flex'}}>
          <input id="input-field" className="input-field" type = {type}
            onChange = {(e) => editInfo(e)} value = {value} name = {name}
          />
          {label!==undefined &&<label htmlFor="input-field" className="input-label">{label}</label>}
        </div>
      );
}

export const EditSubmission = props => {
    const {setData, setEditData, type, id, editData, origData} = props
    const [editUploaded, setEditUploaded] = useState(false);
    const idType = type.replace('s','')+"_id"
    const resetEdit = () => {
        setData(origData)
        setEditData({[idType]:id})
    }
    return (
        <>
            <button className = "resetEditBtn" onClick = {resetEdit}>{labels.undoEditBtn}</button>
            <button className = "submitEditBtn" onClick = {submitEdits({type, id, editData,setEditUploaded,data:origData})}>
                {labels.submit_edits}
            </button>
            {editUploaded&&<p>{labels.successfulEdit}</p>}
        </>
    )
}

export const NewSubmission = props => {
    const {data, type, setData} = props
    const [submissionUploaded, setSubmissionUploaded] = useState(false);
    const requirement = {"authors":"author_name", "texts":"text_title", "editions":"edition_title"}[type]
    return (
        Object.keys(data).includes(requirement) && data[requirement].length>3?
        <>
            <button className = "submitEditBtn" onClick = {uploadNew({setSubmissionUploaded,setData, data, type})}>
                {labels.submit_edits}
            </button>
            <label>{submissionUploaded&&<p>{labels.import_successful_add_new}</p>}</label>
        </>
        :<></>
    )
}

export const EditBulk = props => {
    const {editInputs, data, setData, editData, setEditData} = props
    return (
        <>
        {editInputs.map((inputRow) =>
            (<TableRow label = {inputRow["label"]} key = {inputRow["label"]}>
                <label>
                {inputRow["input"].map((input) => (
                    <InputWithLabel value = {data[input["value"]]===null?"":data[input["value"]]} name = {input["value"]} 
                        type = {input["type"]!==undefined?input["type"]:""}  label = {input["label"]} 
                        setEditData = {setEditData} editData = {editData} data = {data} setData = {setData}
                        key = {input["label"]}
                        /> )
                )}
                </label>
            </TableRow>))}
        </>
    )
}

export const EditWindow = props => {
    const editInputs = props.cols; //list of dictionaries with (1) label key, (2) a list of input values (with type?), (3) explanation text
    const {data, origData, type, id, additionalEdits, setData} = props
    const idType = type.replace('s','')+"_id"
    const [editData, setEditData] = useState({[idType]:id,...additionalEdits});
    useEffect(() => {
        let newEdit = editData
        setEditData({...newEdit,...additionalEdits})
    },[additionalEdits])
    return (
        <>
            <EditBulk editInputs = {editInputs} data = {data} setData = {setData} editData = {editData} setEditData = {setEditData}/>
            {props.children}
            <TableRow>
                {id!==null?<EditSubmission setData={setData} setEditData = {setEditData} type = {type} 
                    id = {id} editData = {editData} origData = {origData}/>
                :<NewSubmission type = {type} data = {data} setData = {setData}/>
                }
            </TableRow>
        </>
    )
}

export const SearchResults = props => {
    const {type, query} = props;
    const [searchResults, setSearchResults] = useState([]);
    useEffect (fetchSearchResults({query, setSearchResults, type: type}),[query])  
    return (
        <div>
            <Select placeholder="Click for results" value={query} options = {typeof searchResults === 'object'?(searchResults):void(0)}/>
            <label style = {{fontSize:'0.7em',fontFamily:'Arial', fontStyle: 'Italic'}}>
                {(searchResults.length>0)?"#" + searchResults.length + " similar available":""}
            </label>
        </div>
    )
}

export const EditSelect = props => {
    const {placeholder, data, setData, type, setAdditionalEdits, label, addedInputs} = props;
    const addedInputKeys = Object.keys(addedInputs);
    const [searchResults, setSearchResults] = useState();
    const [query, setQuery] = useState("");
    useEffect (fetchSearchResults({query, setSearchResults, type: type}),[query])  
    const selectQuery = (event) => {if (event.length>3){setQuery(event);}}
    const searchSelect = (event) => {
        const newData = data;
        const {__isNew__} = event
        let toAdd = {}
        if (__isNew__) {toAdd = {[addedInputKeys[0]]:event.value}}
        else {
            for (let key in addedInputKeys) {
                const col = addedInputKeys[key]
                toAdd[col] = event[addedInputs[col]]
            }
        }
        setAdditionalEdits(toAdd);
        setData({...newData,...toAdd})
    }
    return (
        <TableRow label = {labels[label] + " "}>
        <div style = {{display:'inline-flex'}}>
            <CreateableSelect 
                isClearAble
                placeholder={placeholder}
                options = {typeof searchResults === 'object'?(searchResults):void(0)}
                onInputChange = {selectQuery}
                onChange = {searchSelect}
                getOptionValue = {(option) => option.author_id}
            />
        </div>
        </TableRow>
    )
}

export const AuthorEdit = props => {
    const {origData, data, setData, setEdit, type, id, cols} = props
    const [additionalEdits, setAdditionalEdits] = useState({})
    const addAdditional = (e) => {
        const newData = e.target.value.split("\n").join(", ")
        setData({...data, [e.target.name]:newData})
        setAdditionalEdits({[e.target.name]:newData})
    }
    return (
        <>
            <EditWindow cols = {cols} data = {data} origData = {origData} setData = {setData}
                setEdit = {setEdit} type = {type} id = {id} additionalEdits = {additionalEdits}>
            <TableRow label = {labels.occupation + " "}>
                <TextareaAutosize value = {data["author_positions"]!==undefined?data["author_positions"].split(", ").join("\n"):""}
                    name = "author_positions"
                    onChange = {(e) => addAdditional(e)}
                />
            </TableRow>
            </EditWindow>
        </>
    )

}

export const TextEdit = (props) => {
    const {origData, data, setData, setEdit, type, id, cols} = props
    const [additionalEdits,setAdditionalEdits] = useState({});
    const addedInputs = {'text_author':'author_name', 'author_id':'author_id'}
    return (
        <>
            <EditSelect placeholder = {data.text_author?data.text_author:"find an author in the system"}
                data = {data} setData = {setData} type = {"authors"} setAdditionalEdits = {setAdditionalEdits} 
                label = "author_name" addedInputs = {addedInputs}
                />
            <EditWindow cols = {cols} data = {data} origData = {origData} setData = {setData}
                setEdit = {setEdit} type = {type} id = {id} additionalEdits = {additionalEdits}/>
        </>
    )
}
export default EditWindow