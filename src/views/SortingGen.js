import React from "react";
const SortingGen = ({lang, labels, sortOptions,sort,setSort, type, params, setParams}) => {
    const handleChange = e => {setSort({value:e.target.value, label:e.target.label, order:sort.order})
                                const existingParams = new URLSearchParams(params.toString());
                                existingParams.set("sort", e.target.value)
                                existingParams.set("sort_order", sort.order)
                                setParams(existingParams);}
    const sortOrder = () => {setSort({...sort, order:sort.order==='asc'?'desc':'asc'});
                                const existingParams = new URLSearchParams(params.toString())
                                existingParams.set("sort_order",sort.order==='asc'?'desc':'asc')
                                setParams(existingParams);}
    const options = sortOptions[type]
    return (<div className="sort-container">
    <p>Sort By</p>
    <select value = {sort.value} label={sort.value} onChange = {handleChange} className="sort-select">
        {options.map((option) => (<option key = {option.value+option.label} value = {option.value}>{option.label}</option>) )}
    </select>
    <button className="browser-order" onClick={() => sortOrder()}>{`(${sort.order})`}</button>
    </div>)
}
export default SortingGen;