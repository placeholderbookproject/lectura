import React,{useState} from "react";
const ListStatistics = props => {
    const {elements, setElements} = props.properties
    const [type, setType] = useState("all")
    const [filterType, setFilterType] = useState({value:"checks", label:"checked"})
    const filterTypes = [{value:"checks", label:"checked"}, {value:"watch", label:"watchlisted"}]
    const listLength = elements.length
    const buttons = [{label: `${elements.filter(e => e[filterType.value]).length}/${listLength} ${filterType.label}`, value:elements.filter(e=>e[filterType.value]), name:filterType.label}
                    , {label: `${elements.filter(e => !e[filterType.value]).length}/${listLength} not ${filterType.label}`, value:elements.filter(e=>!e[filterType.value]), name:`not ${filterType.label}`}
                    , {label: `All (${listLength}) texts`, value:elements, name:"all"}]
    const setShowType=(btn) => {
        if(btn.name===type){setElements(buttons.find(e=> e.name==="all").value);setType("all")}
        else {setElements(btn.value);setType(btn.name)}}
    const handleChange = (e) => {setFilterType({ value:e.target.value, label:e.target.options[e.target.selectedIndex].innerText });};    
    return (
    <div className="list-statistics">
        {buttons.map(btn => <button className={`list-statistics-btn${type===btn.name?'-active':''}`} onClick={()=>setShowType(btn)}>{btn.label}</button>)}
        <div className="list-statistics-filter">
            <p>Filter by </p>
            <select value={filterType.value} label={filterType.label} onChange={handleChange}>
                {filterTypes.map((s)=><option key={s.label} value={s.value}>{s.label}</option>)}
            </select>
        </div>
    </div>
    )
}
export default ListStatistics;