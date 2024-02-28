import React, {useState} from "react";
import { createNewList } from "../apiEffects";
import { useNavigate } from "react-router-dom";
import ListAddElement from "./ListAddElement";
import ListElements from "./ListElement";

const changeInput = (info, setInfo, event) => {
    const newInfo = {...info.list_info,[event.target.name]:event.target.value}
    setInfo({...info, list_info:newInfo})
}

const RadioComponent = (props) => {
    const inps = [{id:"texts",label:"Texts "},{id:"authors", label:"Authors "}];
    return (
        <div className="radio-container">
            {inps.map((inp) => <React.Fragment key={inp.label}><label>{inp.label}</label>
                <input id={inp.id} name="list_type" type="radio" value={inp.id} key={inp.label+"-input"}
                    onChange={(e)=>{changeInput(props.info,props.setInfo,e);}}/></React.Fragment>)}
        </div>
    )
}

const CreateNewList = (props) => {
    const {userData} = props
    const navigate = useNavigate();
    const [info, setInfo] = useState({list_detail:[],list_info:{list_type:"", hash:userData.hash, user_id:userData.user_id}});
    const [changes,setChanges] = useState({additions:[], removals:[],list_info:{list_id:false}, order_changes:[], delete:false, userData})
    const [error, setError] = useState(!userData?"not_logged_in":"");
    const [filters, setFilters] = useState([])
    const errorMsg = {no_title:"Title cannot be empty", no_description:"Description cannot be empty"}
    const formInputs = [{type:"text",label:"List Title ", id:"list_name"},{type:"textarea",label:"List Description ", id:"list_description"},
                        {type:"radio", component:<RadioComponent/>}];
    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        if(info.list_info.list_title===""){setError("no_title");return;}
        else if (info.list_info.list_description===""){setError("no_description");return;}
        createNewList({...changes,...info})
            .then(result => {navigate(`/lists/${info.list_info.list_type}/${result.list_id+"_"+info.list_info.list_title}`)})
    }
    return (
        <div className="list-tab">
            <div className="list-tab-header"><span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span></div>
        {userData&&<>
            <h2 className="create-list-header">Create a new list</h2>
            <form className="form-container">
                {formInputs.map((inp) => 
                    (inp.type!=="radio"
                        ?<React.Fragment key={inp.id+"-label"}>
                            <label>{inp.label}</label>
                                {inp.type==="text"
                                ?<input type={inp.type} id={inp.id} name={inp.id} key={inp.id+"-text"} onChange={(e)=>changeInput (info, setInfo, e)}/>
                                :<textarea id={inp.id} name={inp.id} key={inp.id+"-textarea"} onChange={(e)=>changeInput (info, setInfo, e)}/>}
                            </React.Fragment>
                        :inp.type==="radio"&&<RadioComponent setInfo={setInfo} info={info} key={inp.id+"-radio"}/>))}
                    {info.list_info.list_type!==""&&<ListAddElement properties = {{type:info.list_info.list_type, info, setInfo, filters, changes, setChanges}}/>}
                    {info.list_detail.length>0&&info.list_info.list_type&&<ListElements properties = {{edit:'true', info, setInfo, changes, setChanges, userData, filters, setFilters}}/>}
                    <button type="submit" className="submit-btn" onClick = {handleSubmit}>Create List</button>
            </form>
            {error!==""&&<p className="list-error">{errorMsg[error]}</p>}
        </>}
            {error==="not_logged_in"&&<p className="sign-in">You need to be logged in to make a list.<button className="return-login-btn" onClick={()=>{navigate("/login")}}>Login here</button></p>}
        </div>
    )
}

export default CreateNewList;