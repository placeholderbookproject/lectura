import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import Signin from "./SigninForm";

const LoginView = (props) => {
    //const loginButtons = [{label:"Continue with Facebook"}, {label:"Continue with Google"}, {label:"Continue with Amazon"}]
    const navigate = useNavigate();
    const [login,setLogin] = useState(false);
    return (
        <div className="login-container">
            {login&&<Signin setUserId={props.setUserId}/>}
            {!login&&<>
            {/*loginButtons.map((login) => <button className="login-btn">{login.label}</button>)*/}
            <p className="login-btn">Already a member? <button onClick={() => setLogin(!login)} className="login-btn">Click here to login</button></p>
            <button className="create-user" onClick={()=>navigate("/register")}>Sign up with email</button>
            <p className="create-user-terms">By creating an account you agree to our Terms of Service and Privacy Policy</p>
            </>}
        </div>
    )
}

/*Next Steps: 
    - APIs in APIs:
            (1) Create User -> add to database
            (2) Login authentification - check input password & username/email with database (remember encryption)
    - Connect to above APIs in apiEffects.js
        - When user created -> redirect to login or main page -> other functions can now be added dependent on user_login
    - Add separate link to register 
    - State in App for if login + user_id: [user,setUser] = useState(false) -> actual id if logged in
    - user_id should handle availability of creating lists
*/
export default LoginView;