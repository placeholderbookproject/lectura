import React from "react";

const Paging = props => {
    const {results, page,setPage, pageLength, setPageLength, urlParams, setUrlParams} = props.properties
    const pageLengthOptions = [{label:'10', value:10},{label:'25',value:25},{label:'50', value:50},{label:'100', value:100},{label:"max", value:results.length}]
    const handleChange = (e) => {setPageLength({value:e.target.value, label:e.target.label})}
    const handleClick = (page) => {
        setPage(page);
        const existingParams = new URLSearchParams(urlParams.toString());
        existingParams.set("page", page)
        setUrlParams(existingParams)
    }
    return (
    <div>
        <select value = {pageLength.value} label={pageLength.label} onChange = {handleChange} className="page-select">
            {pageLengthOptions.map((opt) => (<option key = {opt.value+opt.label} value = {opt.value}>{opt.label}</option>))}
        </select>
        <div>
        <label>Pages </label>
            {Array.from({ length: Math.ceil(results.length/pageLength.value) }).map((_, index) => (
            <button key={index} onClick={() => handleClick(index+1)} className={page===index+1?"page-btn-active":"page-btn"}>{index + 1}</button>))}
        </div>
    </div>
    )
}

export default Paging;