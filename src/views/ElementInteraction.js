import React,{useState} from "react";
const parse = require('html-react-parser');
const ElementInteraction = props => {
    const {user_id, hash,id, condition, conditional, button_name, postFunction, name} = props.values
    const [isTrue, setIsTrue] = useState((condition===undefined)?false:condition)
    const handleClick = () => {
        const newIsTrue = !isTrue;
        setIsTrue(newIsTrue);
        postFunction({condition: newIsTrue, user_id, id, type:name, hash});
    }
    return (<><button className={isTrue?button_name.true:button_name.false} onClick={handleClick}>{parse(conditional[isTrue])}</button></>)
}
export default ElementInteraction;