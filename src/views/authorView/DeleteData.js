import React from "react";
import { postDeleteData } from '../apiEffects';
const DeleteData = props => {
    const {type, userData, data, setData} = props.properties
    const {user_id, hash} = userData, deleted = data[`${type}_deleted`]
    const deleteData = () => {
        const oldData = data
        postDeleteData({type, id:data[`${type}_id`], deleted,user_id, hash})
        setData({...oldData, [`${type}_deleted`]:!deleted})
    }
    return (<button className={`delete-data-btn${deleted?'-active':''}`} onClick={() => deleteData()}>{`${deleted?'Restore':'Delete'}`}</button>)
}
export default DeleteData;