import React, {useState, useEffect} from "react";
import { fetchFilterOptions } from "../apiEffects";
import { filterOptions } from "./filters";
import BrowserFilterValues from "./BrowserFilterValues";
import BrowserFilterRange from "./BrowserFilterRange";

const BrowserFilters = ({lang, labels, type, selectedFilters,setSelectedFilters, setPage}) => {
    const filters = filterOptions(type)
    const [isOpen, setIsOpen] = useState(false);
    const [filterOptionData, setFilterOptionData] = useState({});
    useEffect(() => {fetchFilterOptions(type, setFilterOptionData)},[type])
    return (Object.keys(filterOptionData).length!==0&&<div className="dropdown-browse">
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
                            {filterOptionData[filterOption.property]&&filterOption.type==="list"&&<BrowserFilterValues filter={filterOption} optionValues={filterOptionData[filterOption.property]} 
                                selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} setPage={setPage}/>}
                            {filterOption.type==="range"&&<BrowserFilterRange filter={filterOption} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} setPage={setPage}/>}
                        </div>))}
                    </div>
                </div>
            )}
    </div>)
}
export default BrowserFilters;