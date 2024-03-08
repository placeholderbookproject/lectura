import React, {useState, useEffect} from 'react';

const Filters = ({setTexts, filterOptions, originTexts}) => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        let newTexts = originTexts
        for (let i=0;i<selectedFilters.length;i++) {
            const option = selectedFilters[i]
            if(option.options.length===0){continue}
            newTexts = newTexts.filter((element) => {
                const propertyValues = element[option.property]?element[option.property].split(" | "):[];
                return propertyValues.some((value) => option.options.includes(value));});
        }; setTexts(newTexts);
    },[selectedFilters])
    const handleFilterClick = (property, option) => {
        let updatedFilters;
        const existingFilters = selectedFilters.find((filter) => filter.property === property);
        if (existingFilters) {
          updatedFilters = [...selectedFilters];
          const index = updatedFilters.indexOf(existingFilters), updatedOptions = [...existingFilters.options];
          if (updatedOptions.includes(option)) {updatedOptions.splice(updatedOptions.indexOf(option), 1);} 
          else {updatedOptions.push(option);}
          if (updatedOptions.length === 0) {updatedFilters.splice(index, 1);} 
          else {updatedFilters[index] = { property, options: updatedOptions };}
        } else {updatedFilters = [...selectedFilters, { property, options: [option] }];}
        setSelectedFilters(updatedFilters);
    };
    return (
        <div className="dropdown">
            <div className="filters">
                <div className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>Filters <span className="dropdown-arrow">&#9660;</span></div>
                <button className="clearDropdown" onClick={() => {setTexts(originTexts);setSelectedFilters([])}}>Clear Search</button>
            </div>
            {isOpen && (
                <div className="dropdown-popup">
                    <div className="dropdown-menu">
                    {filterOptions.map((filterOption) => (
                        <div key={filterOption.property}>
                        {filterOption.values.length>0&&
                            <div className="dropdown-menu-label">{filterOption.label}</div>}
                            {filterOption.values.length>0&&filterOption.values.map((value) => (
                            <div key={value} className={`dropdown-menu-option`}>
                                {value}
                                <input type = "checkbox" onClick={() => handleFilterClick(filterOption.property, value)} 
                                    onChange={() =>handleFilterClick(filterOption.property, value)}
                                    checked={selectedFilters.some((filter)=>filter.property === filterOption.property && filter.options.includes(value))}/>
                                </div>))}
                        </div>))
                    }
                    </div>
                </div>
            )}
        </div>)
}

export default Filters;