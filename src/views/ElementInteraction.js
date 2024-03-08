import React,{useState,useEffect} from "react";
import Modal from "./Modal";
import LoginView from "./loginView/LoginForm";
const parse = require('html-react-parser');
const ElementInteraction = ({values}) => {
    const {id, condition, conditional, button_name, postFunction, name, userData, setUserData} = values
    const {user_id, hash} = userData
    const [isTrue, setIsTrue] = useState(false)
    const handleClick = () => {
        const newIsTrue = !isTrue;
        setIsTrue(newIsTrue);
        postFunction({condition: newIsTrue, user_id, id, type:name, hash});
    }
    useEffect(() => {if(condition===undefined){setIsTrue(false)}else{setIsTrue(values.condition)}},[values.condition])
    return (<>{user_id
                ?<button className={isTrue?button_name.true:button_name.false} onClick={handleClick}>{parse(conditional[isTrue])}</button>
                :<Modal triggerButton={<button className={button_name.false}>{parse(conditional[isTrue])}</button>}><LoginView userData={userData} setUserData={setUserData}/></Modal>}</>)
}
export default ElementInteraction;