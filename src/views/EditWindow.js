import labels from './labels.js';
import {submitEdits, fetchSearchResults} from './apiEffects.js';
import Select from 'react-select';
import TableRow from './ViewRow.js';
import {useState, useEffect} from 'react'

export const EditWindow = props => {
    const editInputs = props.cols; //list of dictionaries with (1) label key, (2) a list of input values (with type?), (3) explanation text
    const {data, origData, type, id, setEdit, additionalEdits} = props
    const idType = type.replace('s','')+"_id"
    const [editData, setEditData] = useState({[idType]:id,...additionalEdits});
    useEffect(() => {
        let newEdit = editData
        setEditData({...newEdit,...additionalEdits})
    },[additionalEdits])
    const resetEdit = () => {
        props.setData(origData)
        setEditData({[idType]:id})
    }
    const editInfo = (e) => {
        const {value, name} = e.target
        const oldEdit = editData
        let newData = data
        newData[name] = value
        setEditData({...oldEdit, [name]:value})
        props.setData({...data,[name]:value})
    }
    /*useEffect(() => {setEditData({'author_id':props.author.author_id})},[props.author.author_id])*/
    return (
        <>
            {editInputs.map((inputRow) =>
                (<TableRow label = {inputRow["label"]}>
                    <label>
                    {inputRow["input"].map((input) => (
                        <input value = {data[input["value"]]===null?"":data[input["value"]]} name = {input["value"]} 
                            onChange = {(e) => editInfo(e)} type = {input["type"]!==undefined?input["type"]:""}/>)
                    )}
                    {inputRow["explanationText"]}
                    </label>
                </TableRow>)
            )}
            <TableRow>
                <>
                <button className = "resetEditBtn" onClick = {resetEdit}>{labels.undoEditBtn}</button>
                <button className = "submitEditBtn" onClick = {submitEdits({type, id, editData,setEdit,data:origData})}>
                    {labels.submit_edits}</button>
                </>
            </TableRow>
        </>
    )
}

export const TextEdit = (props) => {
    const {origData, data, setData, setEdit, type, id, cols} = props
    const [searchResults, setSearchResults] = useState();
    const [query, setQuery] = useState("");
    const [additionalEdits,setAdditionalEdits] = useState({});
    useEffect (fetchSearchResults({query, setSearchResults, type: "authors"}),[query])  
    const selectQuery = (event) => {if (event.length>3){setQuery(event);}}
    const searchSelect = (event) => {
        let newData = data;
        setAdditionalEdits ({text_author:event.author_name, author_id:event.author_id});
        setData({...newData, text_author: event.author_name, author_id: event.author_id})
    }
    return (
        <>
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
            <EditWindow cols = {cols} data = {data} origData = {origData} setData = {setData}
                setEdit = {setEdit} type = {type} id = {id} additionalEdits = {additionalEdits}/>
        </>
    )
}
export default EditWindow