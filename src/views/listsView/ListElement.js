import React, {useState,useEffect} from 'react';
import { postTextInteraction } from '../apiEffects.js';
import {options} from '../filters.js';
import ElementInteraction from '../ElementInteraction.js';
import ListFilters from './ListFilters.js';
import ListStatistics from './ListStatistics.js';

const ListElements = (props) => {
    const {info, setInfo, edit, changes, setChanges, userData, filters, setFilters} = props.properties
    const list_type = info.list_info.list_type
    const elementInteractions = [{name:"checks", conditional:{true:"",false:""}, button_name:{true:"check-btn", false:"check-btn"}, label:"Check"},
                                {name:"watch", conditional:{true:"+",false:"+"}, button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, label:"Watchlist"}]
    const [elements, setElements] = useState(info.list_detail)
    const [query, setQuery] = useState("")
    const removeElement = (element) => {
        setInfo(prevInfo => {
            const updatedInfo = { ...prevInfo };
            const index = updatedInfo.list_detail.findIndex(item => item.value === element.value);
            if (index !== -1) {updatedInfo.list_detail.splice(index, 1);} return updatedInfo;
        });
        const oldChanges = changes
        const index = oldChanges.additions.findIndex(item => item.value === element.value)
        if(index !== -1) {
            oldChanges.additions.splice(index,1);
            setChanges({...oldChanges});
            return;
        }; setChanges({...oldChanges,removals:[...oldChanges.removals,...[element]],additions:oldChanges.additions});
    }
    const handleDragOver = (event) => {event.preventDefault();};
    const handleDragStart = (event, rowIndex) => {event.dataTransfer.setData('text/plain', rowIndex);};
    const handleDrop = (event, targetRowIndex) => {
        const oldChanges = changes;
        const draggedRowIndex = event.dataTransfer.getData('text/plain');
        const updatedTableData = [...info.list_detail];    
        const draggedRow = updatedTableData[draggedRowIndex];
        updatedTableData.splice(draggedRowIndex, 1);
        updatedTableData.splice(targetRowIndex, 0, draggedRow);
        setChanges({...oldChanges, order_changes:updatedTableData});
        setInfo({...info, list_detail:updatedTableData});
      };
    const removeColumn = (col) => {
        setFilters(prevFilters => {
            const updatedFilters = [...prevFilters];
            const index = updatedFilters.findIndex(item => item.label === col.label)
            if(index!== -1){updatedFilters.splice(index,1);} return updatedFilters;
        })
    }
    useEffect(() => {if(info.list_info){setElements(info.list_detail);setFilters(options[list_type].slice(0,3))}},[info])
    useEffect(()=>{if(query.length>3){const results = info.list_detail.filter(e => e.label.includes(query));setElements(results)}
        else if (query.length===0){setElements(info.list_detail)}},[query])
    return (
        <div>
            <input type="text" placeholder="Search for an element" value={query} onChange={(e)=>setQuery(e.target.value)} className="list-search-input"/>
            <ListFilters properties={{filters, setFilters, type:list_type}}/>
            {list_type==="texts"&&<ListStatistics properties={{elements:info.list_detail, setElements}}/>}
            {filters&&filters.length>0&&
            <table className="drag-table"><tbody>
                <tr>
                    <th>#</th>
                    {filters.map((col) =>  <th key={col.label}>{col.label}<button className="remove-col-btn" onClick={() => removeColumn(col)}>X</button></th>)}
                    {list_type==="texts"&&elementInteractions.map(e => <th>{e.label}</th>)}
                    {edit&&<th></th>}
                </tr>
                {elements.map((element, elementIndex) =>
                    <tr key={elementIndex} draggable={edit} onDragOver={handleDragOver} onDragStart={(event) => handleDragStart(event, elementIndex)}
                        onDrop={(event) => handleDrop(event, elementIndex)} className={`list-element${edit?"-draggable":""}`}>
                        <td>{elementIndex+1}</td>
                        {filters.map((col, colIndex) => col.value==="label"
                            ?<td key={colIndex}><a href={`${(element["author_id"]&&list_type!=="authors")?"/author/"+element["author_id"]+"/text/"+element["value"]:"/author/"+element["value"]}`}>{element[col.value]}</a></td>
                            :<td key={colIndex}>{element[col.value]}</td>)}
                        {list_type==="texts"&&
                        elementInteractions.map((e) =><td><ElementInteraction values={
                                {...e, condition:element[e.name], userData,id:element.element_id, postFunction:postTextInteraction}}/></td>)
                        }
                        {edit&&<td><button className="list-remove-element" onClick = {() => removeElement(element)}>X</button></td>}
                    </tr>)}
            </tbody></table>}
        </div>
    )
}
export default ListElements