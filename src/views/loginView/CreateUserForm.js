import React, {useState} from "react";
import {createNewUser} from "../apiEffects";
import { useNavigate } from "react-router-dom";
const bcrypt = require("bcryptjs");

const CreateUserForm = (props) => {
    const formInputs = [{name:"user_name",type:"text", label:"User Name ", autoComplete:"off"}
                    ,{name:"user_email", type:"email",label: "Email ", autoComplete:"off"},
                    {name:"user_password", type:"password",  label:"Password ", autoComplete:"new-password"},
                    {name:"user_password_confirmation",type:"password",label:"Re-enter Password ", autoComplete:"new-password"}]
    const [input, setInput] = useState({user_name:"", user_email:"", user_password:"", user_password_confirmation:""});
    const navigate = useNavigate();
    const [userExists, setUserExists] = useState(false);
    const changeInput = (event) => {
        const oldInput = input;
        setInput({...oldInput, [event.target.name]:event.target.value})
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        bcrypt.hash(input.user_password,10)
        .then(result => createNewUser({user_name:input.user_name, user_email:input.user_email, user_password:result}))
        .then((response) => {
                if(response.message !== "Duplicate") {props.setUserId(response);navigate("/")}
                else if(response.message==="Duplicate"){setUserExists(true)}
            })
    }
    return (
        <>
        <h2>Create Account</h2>
        <form className="form-container" >
            {userExists&&<p className="email-error">Email already exists</p>}
            {formInputs.map((inp) => (
                <><label className="form-label" key={inp.label}>{inp.label}</label>
                    <input type={inp.type} value={input[inp.name]} key={"input"+inp.label} onChange={changeInput}
                        name={inp.name} className="register-input" required minLength="6" size="30" autoComplete={inp.autoComplete}/>
                    {inp.name==="user_password_confirmation"&&(input.user_password!==input.user_password_confirmation)&&
                        <p className="pw-error">Passwords do not match</p>}
                </>
                ))}
            <button type="submit" onClick = {handleSubmit}>Submit</button>
        </form>
        </>
    )
}

export default CreateUserForm;