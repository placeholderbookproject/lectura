import React, {useState, useEffect} from 'react';
import { fields } from './input_fields';
const AddForm = ({addType, userData, labels}) => {
    const [inputValues, setInputValues] = useState({})
    const inputs = fields(addType)
    useEffect(() => {
        let dictionary = {};
        fields(addType).forEach(item => {dictionary[item.dict] = '';})
        setInputValues(dictionary)},[addType])
    const changeInput = (event) => {
        const oldInput = inputValues;
        setInputValues({...oldInput, [event.target.name]:event.target.value})
    }
    return (
        <div className="add-inputs">
        <form className="form-container">
        {inputs!==undefined&&inputs.map((field) =>
            <p className="viewRow"><span style = {{"fontWeight": 600,}}>{field.label}</span>
                <input type={field.type} name={field.dict} value={inputValues[field.dict]} autoComplete="yes" onChange={changeInput}/></p>
        )}
        {/*Find Author for text - obligatory for submission */}
        {/*Automatically list "similar" authors if author addition */}
        {/*Submission Button */}
        </form>
    </div>)
}
export default AddForm;