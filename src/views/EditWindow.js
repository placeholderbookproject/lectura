import labels from './labels.js';
import {submitEdits} from './apiEffects.js';
import TableRow from './ViewRow.js';
import {useState} from 'react'

const EditWindow = props => {
    const editInputs = props.cols; //list of dictionaries with (1) label key, (2) a list of input values (with type?), (3) explanation text
    const {data, origData, type, id, setEdit} = props
    const idType = type.replace('s','')+"_id"
    const [editData, setEditData] = useState({[idType]:id});
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
                            onChange = {(e) => editInfo(e)}/>
                    )
                    )}
                    {inputRow["explanationText"]}
                    </label>
                </TableRow>)
            )}
            <TableRow>
                <>
                <button className = "resetEditBtn" onClick = {resetEdit}>{labels.undoEditBtn}</button>
                <button className = "submitEditBtn" onClick = {submitEdits({type, id, editData,setEdit,data})}>
                    {labels.submit_edits}</button>
                </>
            </TableRow>
        </>
    )
}
export default EditWindow