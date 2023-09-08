import React,{useState} from "react";
import { changeFormInput } from "../commonFuncs";
import { updateUserData, loginUser } from "../apiEffects";
const bcrypt = require("bcryptjs");

const EditProfile = props => {
    const {edit, setEdit, userData,editType} = props.properties
    const formInputs = editType==="user_password"?[{name:"old_password",type:"password", label:"Old Password ", autoComplete:"off"},
                        {name:"new_password", type:"password",  label:"New Password ", autoComplete:"off"},
                        {name:"repeat_new_password", type:"password", label:"Repeat New Password ", autoComplete:"off"}]
                        :[{name:"new_user_name", type:"text",label:"New User Name", autoComplete:"off"}]
    const submissionLabel = {user_name:"Change User Name", user_password: "Change Password"}
    const [input, setInput] = useState({old_password:"", new_password:"", repeat_new_password:"", new_user_name:""});
    const [error, setError] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        if((input.new_password===input.repeat_new_password&&input.new_password!=="")||editType==="user_name"){
            if (editType==="user_password"){
                loginUser({user:userData.user_name})
                .then((result) => {return bcrypt.compare(input.old_password, result.pw)})
                .then((response) => {
                        if(response===true)
                            {bcrypt.hash(input.new_password,10).then(result => 
                                updateUserData({user_id:userData.user_id, change_type:editType, change_value:result, hash:userData.hash}))}
                        else {setError("You have entered the wrong password")}})} 
            else if (editType==="user_name"){
                updateUserData({user_id:userData.user_id, change_type:editType, change_value:input.new_user_name, hash:userData.hash}).then(() => setEdit(!edit))}
        } else {if(input.new_password!==input.repeat_new_password){setError("The new password does not match")}}
    }
    return (<div className="edit-profile-container">
        <button className="return-btn" onClick={()=>setEdit(!edit)}>&#8592; Return</button>
        {editType==="user_name"&&<p className="user-name">{`Old User Name: ${userData.user_name}`}</p>}
        <form className="form-container">
            {formInputs.map((inp) => (
                <><label className="form-label" key={inp.label}>{inp.label}</label>
                    <input type={inp.type} value={input[inp.name]} key={"input"+inp.label} onChange={(event) => changeFormInput(input, setInput, event)}
                        name={inp.name} className="register-input" required minLength="6" size="30" autoComplete={inp.autoComplete}/>
                </>))}
            <button type="submit" className="submit-btn" onClick = {handleSubmit}>{submissionLabel[editType]}</button>
        </form>
        {error&&<p>{error}</p>}
    </div>)
}
export default EditProfile;