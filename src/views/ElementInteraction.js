import React,{useState,useEffect} from "react";
const parse = require('html-react-parser');
const ElementInteraction = props => {
    const {user_id, hash,id, condition, conditional, button_name, postFunction, name} = props.values
    const [isTrue, setIsTrue] = useState(false)
    const handleClick = () => {
        const newIsTrue = !isTrue;
        setIsTrue(newIsTrue);
        postFunction({condition: newIsTrue, user_id, id, type:name, hash});
    }
    useEffect(() => {if(condition===undefined){setIsTrue(false)}else{setIsTrue(condition)}},[condition])
    return (<><button className={isTrue?button_name.true:button_name.false} onClick={handleClick}>{parse(conditional[isTrue])}</button></>)
}
export default ElementInteraction;