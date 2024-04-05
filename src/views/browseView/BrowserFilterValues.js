import React,{useState} from "react";

const BrowserFilterValues = ({selectedFilters, setSelectedFilters, filter, optionValues, setPage}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredOptions = optionValues.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()));
    const [checkFilters, setCheckFilters] = useState([])
    const handleInputChange = (event) => {setSearchTerm(event.target.value);};
    const handleFilterClick = (filter, option) => {
        let updatedFilters = [...checkFilters]
        const index = checkFilters.indexOf(option);
        if(index !==-1) {updatedFilters.splice(index, 1)}
        else{updatedFilters.push(option)};
        setSelectedFilters({...selectedFilters,[filter.property]:updatedFilters})
        setPage(1)
        setCheckFilters(updatedFilters)
    };
    return (<div>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={handleInputChange}/>
        <div className="checkbox-list">
        {filteredOptions.length>0&&filteredOptions.map((value) => (
        <div key={value} className={`dropdown-menu-option`}>
        {value} 
            <input type = "checkbox" onClick={() => handleFilterClick(filter, value)} 
                onChange={() => handleFilterClick(filter, value)}
                checked={checkFilters.some((opt)=>opt.includes(value))}/>
        </div>))}
        </div>
      </div>)
};
export default BrowserFilterValues;