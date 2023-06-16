import React from 'react';

const ListElement = (props) => {
    const {info, setInfo, edit} = props
    const removeElement = (element) => {
        setInfo(prevInfo => {
            const updatedInfo = { ...prevInfo };
            const index = updatedInfo.list_detail.findIndex(item => item.value === element.value);
            if (index !== -1) {updatedInfo.list_detail.splice(index, 1);}
            return updatedInfo;
        });
    }
    return (
        info&&info.list_detail&&info.list_detail.map((element) => 
            <span className="list-element"><p>{element.label}</p>{edit&&<button onClick = {() => removeElement(element)}>X</button>}</span>
        )
    )
}
export default ListElement