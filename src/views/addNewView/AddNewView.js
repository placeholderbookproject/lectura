import React,{useState} from "react";
import AddForm from "./AddForm";

const AddNewView = ({lang, userData, labels}) => {
    const [addType, setAddType] = useState("Author");
    const types = ["Author", "Text"]
    return (<>
        <div className="add-header">{types.map(head => 
            <button className={`header${head===addType?'-active':''}`} onClick={() => setAddType(head)} key={head}>{head}</button>)}</div>
        <AddForm addType={addType} userData={userData} labels={labels}/>
        </>
    )
}
export default AddNewView;