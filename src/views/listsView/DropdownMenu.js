import React, {useState} from 'react';
const DropdownMenu = ({name, options, setFilters, filters}) => {
    const [selected, setSelected] = useState("all");
    const handleChange = e => {
        setSelected(e.target.value)
        const newFilters = {...filters, [name]:e.target.value}
        setFilters(newFilters)
    }
    return (
    <div className="dropdown">
        <label className="dropdown-label">{`Select a ${name}`}</label>
        <select value={selected} onChange={handleChange}>{options.map((option) => (<option key={option} value={option}>{option}</option>))}</select>
    </div>
    )
}
export default DropdownMenu;