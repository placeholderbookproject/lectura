import React,{useState} from "react";
import { postCheck } from "./apiEffects";
const parse = require('html-react-parser');
const Check = props => {
    const {check, user_id, text_id} = props
    const [checked, setChecked] = useState(check)
    const handleClick = () => {
        const newCheck = !checked;
        setChecked(newCheck);
        postCheck({check: newCheck, user_id, text_id});
    }
    return (<>
        <button className="check-btn" onClick={handleClick}>{checked?parse("&#9745;"):parse("&#9744;")}</button>
    </>)
}
export default Check;