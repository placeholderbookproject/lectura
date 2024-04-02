import React, {useState, useEffect} from "react";
import { fetchFilterOptions } from "../apiEffects";
import { filterOptions } from "./filters";
import BrowserFilterValues from "./BrowserFilterValues";
const BrowserFilters = ({lang, labels, type, selectedFilters,setSelectedFilters}) => {
    const filters = filterOptions(type)
    const [isOpen, setIsOpen] = useState(false);
    const [filterOptionData, setFilterOptionData] = useState({});
    useEffect(() => {fetchFilterOptions(type, setFilterOptionData)},[])
    return (Object.keys(filterOptionData).length>0&&<div className="dropdown">
        <div className="filters">
            <div className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>Filters <span className="dropdown-arrow">&#9660;</span></div>
            <button className="clearDropdown" onClick={() => {setSelectedFilters({})}}>Clear Filters</button>
        </div>
        {isOpen && (
                <div className="dropdown-popup-browse">
                    <div className="dropdown-menu">
                    {filters.map((filterOption) => (
                        <div key={filterOption.property}>
                            <div className="dropdown-menu-label">{filterOption.label}</div>
                            <BrowserFilterValues filter={filterOption} optionValues={filterOptionData[filterOption.property]} 
                                selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>
                        </div>))}
                    </div>
                </div>
            )}
    </div>)
}
export default BrowserFilters;