import React, {useState} from "react";
import { changeFormInput } from "../commonFuncs";
import { createNewList } from "../apiEffects";
import { useNavigate } from "react-router-dom";

const RadioComponent = (props) => {
    const inps = [{id:"texts",label:"Texts "},{id:"authors", label:"Authors "}];
    return (
        <div className="radio-container">
            {inps.map((inp) => <React.Fragment key={inp.label}><label>{inp.label}</label>
                <input id={inp.id} name="list_type" type="radio" value={inp.id} key={inp.label+"-input"}
                onChange={(event) => changeFormInput(props.input,props.setInput, event)}/></React.Fragment>)}
        </div>
    )
}

const CreateNewList = (props) => {
    const navigate = useNavigate();
    const [input, setInput] = useState({list_title:"",list_description:"",list_type:"", user_id:props.userData.user_id})
    const [error, setError] = useState(!props.userData?"not_logged_in":"");
    const errorMsg = {no_title:"Title cannot be empty", no_description:"Description cannot be empty"}
    const formInputs = [{type:"text",label:"List Title ", id:"list_title"},{type:"textarea",label:"List Description ", id:"list_description"},
                        {type:"radio", component:<RadioComponent/>}];
    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        if(input.list_title===""){setError("no_title");return;}
        else if (input.list_description===""){setError("no_description");return;}
        createNewList(input)
            .then(result => {navigate(`/lists/${input.list_type}/${result.list_id+"_"+input.list_title}`)})
    }
    return (
        <div className="register-container">
        {props.userData&&<>
            <h2 className="create-list-header">Create a new list</h2>
            <form className="form-container">
                {formInputs.map((inp) => 
                    (inp.type!=="radio"
                        ?<React.Fragment key={inp.id+"-label"}>
                            <label>{inp.label}</label>
                                {inp.type==="text"
                                ?<input type={inp.type} id={inp.id} name={inp.id} key={inp.id+"-text"} onChange={(event) => changeFormInput (input, setInput, event)}/>
                                :<textarea id={inp.id} name={inp.id} key={inp.id+"-textarea"} onChange={(event) => changeFormInput (input, setInput, event)}/>}
                            </React.Fragment>
                        :inp.type==="radio"&&<RadioComponent setInput={setInput} input={input} key={inp.id+"-radio"}/>))}
                    <button type="submit" className="submit-btn" onClick = {handleSubmit}>Create List</button>
            </form>
            {error!==""&&<p className="list-error">{errorMsg[error]}</p>}
            </>}
            {error==="not_logged_in"&&<p className="sign-in">You are not logged in.<button className="return-login-btn" onClick={()=>{navigate("/login")}}>Login here</button></p>}
        </div>
    )
}

export default CreateNewList;