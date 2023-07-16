import React, {useState, useEffect} from 'react';
import {options} from '../filters.js';
import Select from 'react-select';
import { postTextInteraction } from '../apiEffects.js';
import TextInteraction from '../TextInteraction.js';

const ListElement = (props) => {
    const {info, setInfo, edit, changes, setChanges, userData} = props
    const elementInteractions = [{name:"checks", conditional:{true:"&#9745;",false:"&#9744;"}, button_name:{true:"check-btn", false:"check-btn"}, label:"Check"},
                                {name:"watch", conditional:{true:"+",false:"+"}, button_name:{true:"watchlist-btn-active",false:"watchlist-btn"}, label:"Watchlist"}]
    const columnOptions = info.list_info&&options[info.list_info.list_type]
    const [filters, setFilters] = useState([])
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
        }; setChanges({removals:[...oldChanges.removals,...[element]],additions:oldChanges.additions});
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
    useEffect(() => {info.list_info&&setFilters(options[info.list_info.list_type].slice(0,3))},[info.list_info])
    return (
        info&&info.list_detail&&
        <div>
            <Select options = {columnOptions} onChange = {(e) => setFilters(e)} value = {filters} placeholder = {"Select visible columns"} isMulti/>
            {filters&&filters.length>0&&
            <table className="drag-table"><tbody>
                <tr>
                    <th>#</th>
                    {filters.map((col) => 
                    <th key={col.label}>{col.label}<button className="remove-col-btn" onClick={() => removeColumn(col)}>X</button></th>)}
                    {edit&&<th></th>}
                    {info.list_info.list_type==="texts"&&elementInteractions.map(e => <th>{e.label}</th>)}
                </tr>
                {info.list_detail.map((element, elementIndex) =>
                    <tr key={elementIndex} draggable={edit} onDragOver={handleDragOver} onDragStart={(event) => handleDragStart(event, elementIndex)}
                        onDrop={(event) => handleDrop(event, elementIndex)} className={`list-element${edit?"-draggable":""}`}>
                    <td>{elementIndex+1}</td>
                    {filters.map((col, colIndex) => <td key={colIndex}>{element[col.value]}</td>)}
                    {edit&&<td><button className="list-remove-element" onClick = {() => removeElement(element)}>X</button></td>}
                    {info.list_info.list_type==="texts"&&
                        elementInteractions.map((e) =><td><TextInteraction values={
                                {...e, condition:element[e.name], user_id:userData.user_id, text_id:element.element_id, postFunction:postTextInteraction}}/></td>)
                        }
                    </tr>)}
            </tbody></table>}
        </div>
    )
}
export default ListElement