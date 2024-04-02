import React from "react";
const sortAuthor = () => [{label: 'Language', value:'author_name_language'},{label:'Birth Year', value:'author_birth_year'}
            , {label:'Death Year', value:'author_death_year'}]
const sortText = () => [{label: 'Language', value:'text_language'},{label:'Publication Year', value:'text_original_publication_year'}
, {label:'Text Author', value:'text_author'}]
export const sortOptions = type => type==="authors"?sortAuthor():sortText()

const BrowserSort = ({lang, labels, sort,setSort, type}) => {
    const handleChange = e => {setSort({value:e.target.value, label:e.target.label});}
    const options = type==="authors"?sortAuthor():sortText()
    return (<div className="sort-container">
    <p>Sort By</p>
    <select value = {sort.value} label={sort.value} onChange = {handleChange} className="sort-select">
        {options.map((option) => (<option key = {option.value+option.label} value = {option.value}>{option.label}</option>) )}
    </select>
    </div>)
}
export default BrowserSort;