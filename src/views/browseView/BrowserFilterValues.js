import React,{useState} from "react";

const ValueSearchBox = ({selectedFilters, setSelectedFilters, filter, optionValues}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredOptions = optionValues.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()));
    const [checkFilters, setCheckFilters] = useState([])
    const handleInputChange = (event) => {setSearchTerm(event.target.value);};
    const handleFilterClick = (property, option) => {
        let updatedFilters = [...checkFilters]
        const index = checkFilters.indexOf(option);
        if(index !==-1) {updatedFilters.splice(index, 1)}
        else{updatedFilters.push(option)};
        setSelectedFilters({...selectedFilters,[property.property]:updatedFilters})
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

const BrowserFilterValues = ({filter, optionValues, selectedFilters, setSelectedFilters}) => {
    return (
        <ValueSearchBox selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} optionValues={optionValues} filter={filter}/>
        )
}
export default BrowserFilterValues;