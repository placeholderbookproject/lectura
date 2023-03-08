import {Popup} from './AddNew.js'
import { useState } from "react";
import {SHA256} from 'crypto-js';
import {verifyLogin, createUser} from './apiEffects.js';

const EmailForm = props => {
    const formType = props.type
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(false);  
    const handleEmailChange = (event) => {setEmail(event.target.value);};
    const handlePasswordChange = (event) => {setPassword(event.target.value);};
    const handleSubmit = async (event) => {
        event.preventDefault();
        const hashedPassword = await SHA256(password);
        formType==="newUser"?createUser({setResponse},hashedPassword,email):verifyLogin({setResponse},hashedPassword, email)
        // send the email and hashed password to the server for authentication
    };
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="email" value={email} onChange={handleEmailChange} autoComplete="username" />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} autoComplete={formType==="newUser"?"new-password":"current-password"} />
            </label>
            <input type="submit" value="Submit"/>
            {response!==false?<p>Alreadty exists</p>:<></>}
        </form>
    )
}

const LoginWindow = props => {
    const [login, setLogin] = useState(false);
    const [createUser, setCreateUser] = useState(false);
    return (
        <>
            <Popup label = "Login">
                <button onClick = {() => {setCreateUser(!createUser);setLogin(false);}}>Sign up with email</button>
                <label>Already a member? <button onClick = {() => {setLogin(!login); setCreateUser(false)}}>Sign In</button></label>
                {login?<EmailForm type="logIn"/>:<></>}
                {createUser?<EmailForm type="newUser"/>:<></>}
            </Popup>
        </>
    )
}

export default LoginWindow