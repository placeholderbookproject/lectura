import labels from './labels.js';

const EditWindow = (props) => {
    const {id, editData, setEdit, setEditWindow, resetEdit, data, edit, type, submitEdits} = props
    return (
        <div>
            <button className = "editBtn" onClick = {setEditWindow}>{!edit?labels.editBtn:labels.exitEditBtn}</button>
            {edit?
                <>
                    <button className = "resetEditBtn" onClick = {resetEdit}>{labels.undoEditBtn}</button>
                    <button className = "submitEditBtn" onClick = {submitEdits({type, id, editData,setEdit,data})}>
                        {labels.submit_edits}</button>
                </>
                :<></>}
        </div>        
    )
}
export default EditWindow