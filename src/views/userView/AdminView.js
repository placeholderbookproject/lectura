import React, {useState, useEffect} from "react";
import { getAdminData, postRoleChange } from "../apiEffects";

const UserRow = props => {
    const [data, setData] = useState(props.element)
    useEffect(() => setData(props.element), [props.element])
    const handleChange = e => {setData({...data, user_role:e.target.value});}
    const options = ["basic","premium","administrator"]
    const updateRole = () => {postRoleChange({user_id:props.userData.user_id, hash:props.userData.hash, change_user:data.user_id, new_role:data.user_role})}
    return (<div className="user-container">
        <p>{`User Id #${data.user_id}: ${data.user_name} (${data.user_created}): `}</p>
        <select value = {data.user_role} label={data.user_role} onChange = {handleChange} className="language-select">{options.map((option) => (<option key = {option} value={option}>{option}</option>))}</select>
        <button onClick={()=>updateRole()}>Update</button>
    </div>
    )
}
const AdminView = props => {
    const {userData} = props
    const [data, setData] = useState([])
    useEffect(()=>{getAdminData(userData.user_id, userData.hash, "users", setData)},[userData])
    return (<div>
        {data.length>0&&data.map((user,index) => <UserRow element={user} index={index} userData={userData} />)}
    </div>)
}
export default AdminView;