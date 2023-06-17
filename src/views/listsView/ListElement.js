import React from 'react';

const ListElement = (props) => {
    const {info, setInfo, edit, changes, setChanges} = props
    const removeElement = (element) => {
        setInfo(prevInfo => {
            const updatedInfo = { ...prevInfo };
            const index = updatedInfo.list_detail.findIndex(item => item.value === element.value);
            if (index !== -1) {updatedInfo.list_detail.splice(index, 1);}
            return updatedInfo;
        });
        const oldChanges = changes
        const index = oldChanges.additions.findIndex(item => item.value === element.value)
        if(index !== -1) {
            oldChanges.additions.splice(index,1)
            setChanges({...oldChanges})
            return;
        }
        setChanges({removals:[...oldChanges.removals,...[element]],additions:oldChanges.additions})
    }
    return (
        info&&info.list_detail&&info.list_detail.map((element) => 
            <span className="list-element" key={element.value}><p>{element.label}</p>{edit&&<button onClick = {() => removeElement(element)}>X</button>}</span>
        )
    )
}
export default ListElement