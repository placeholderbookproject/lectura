import React,{useState, useEffect} from "react";
const BrowserFilterRange = ({filter, selectedFilters, setSelectedFilters, setPage}) => {
    const [range, setRange] = useState({min:'',max:''})
    const updRange = (e, type) => {setRange({...range, [type]:e.target.value});setPage(1)}
    useEffect(()=> {setSelectedFilters({...selectedFilters,[filter.property]:range})},[range])
    return (<div className="range-container">
        <label>
            <input type="number" value={range.min} max={2200} onChange={(e) => updRange(e,"min")}/>-
            <input type="number" value={range.max} max={2200} onChange={(e) => updRange(e,"max")}/>
        </label>
      </div>)
}
export default BrowserFilterRange;