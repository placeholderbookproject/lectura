import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../apiEffects";
import Cookies from 'js-cookie';
const bcrypt = require("bcryptjs");

const Signin = (props) => {
    const [input, setInput] = useState({user_name:"", user_password:""});
    const [error, setError] = useState(false);
    const [user,setUser] = useState(false);
    const [login, setLogin] = useState(false);
    const errors = {no_user:"There is no user with that user name or email", wrong_pw:"The password you entered is wrong"}
    const navigate = useNavigate();
    const formInputs = [{name:"user_name",type:"email", label:"User Name or Email ", autoComplete:"current-email"}
                    ,{name:"user_password", type:"password",label: "Password ", autoComplete:"current-password"}]
    const changeInput = (event) => {
        const oldInput = input;
        setInput({...oldInput, [event.target.name]:event.target.value})
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser({user:input.user_name})
        .then((result) => {
            if(result!==false){
                setUser({user_id:result.user_id, user_name:result.user_name, user_email:result.user_email, hash:result.hash})
                return bcrypt.compare(input.user_password, result.pw)}
            else {return "no_user"}})
        .then ((response) => {
            if(response===true){setLogin(true);}
            else if (response==="no_user"){setError("no_user")}
            else {setError("wrong_pw")}})
    }
    useEffect(() => {
        if(user!==false&&login){props.setUserData(user);Cookies.set('user', JSON.stringify(user), { expires: 7 })}
        else if(user!==false&&!login){setUser(false);}}
    ,[user, login])
    return (<>
        <form className="form-container">
            {formInputs.map((inp) => (
                <><label className="form-label" key={inp.label}>{inp.label}</label>
                    <input type={inp.type} value={input[inp.name]} key={"input"+inp.label} onChange={changeInput}
                        name={inp.name} className="register-input" required minLength="6" size="30" autoComplete={inp.autoComplete}/>
                </>))}
            {error&&<p className="pw-error">{errors[error]}</p>}
            <button type="submit" className="submit-btn" onClick = {handleSubmit}>Log In</button>
        </form>
        <p>Do not have an account? <button className="return-register-btn" onClick={()=>{navigate("/register")}}>Create User</button></p>
    </>)
}

export default Signin;