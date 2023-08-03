import React from "react";
import {options} from '../filters.js';
import Select from 'react-select';
const ListFilters = props => {
    const {filters, setFilters, type} = props.properties
    const columnOptions = options[type]
    return (<Select options = {columnOptions} onChange = {(e) => setFilters(e)} value = {filters} placeholder = {"Select columns"} isMulti/>)
}
export default ListFilters;