import React, {/*useRef,*/ useState, useEffect} from 'react';
import TableRow from './ViewRow.js';
import labels from './labels.js';
import AuthorTexts from './AuthorTexts.js'
import {searchWikipediaEffect} from './apiEffects.js'
import {checkStr} from './formattingFuncs.js'
const parse = require('html-react-parser');

const AuthorTable = (props) => {
    const [wiki, setWiki] = useState("");
    const [data, setData] = useState(props.data);
    const [edit,setEdit] = useState(false);
    const name = data.author_name.split(",");
    const numNames = name.length;
    const occupationList = data.author_positions.split(", ");
    const mainOccupation = occupationList[0];//(firstOccupation.length>1)?firstOccupation.splice(1,firstOccupation.length).join(" "):occupationList[0];
    useEffect(() => {setData(props.data)},[props.data])
    useEffect (searchWikipediaEffect({setWiki, edit, name:name[0], mainOccupation}),[name,mainOccupation, edit])
    const setEditWindow = () => {
        if (!edit) {setEdit(true)}
        else{setEdit(false)}
    }
    const uploadEdits = () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data)
        };
        fetch('http://127.0.0.1:8000/edit?type=authors&id='+data.author_id, requestOptions)
            .then(response => response.json())
            .finally(() => setEdit(false))
    }

    const editInfo = (e) => {
        const {value, name} = e.target
        let newData = data
        newData[name] = value
        setData({...data,[name]:value})
    }
    return (
    <div>
        <div style = {{left:5, position: 'fixed'}}>
            <button className = "editBtn" onClick = {setEditWindow}>{!edit?labels.editBtn:labels.exitEditBtn}
            </button>
            {edit?
                <>
                    {/*<button onClick = {undoEdit}>{labels.undoEditBtn}</button>*/}
                    <button className = "submitEditBtn" onClick = {uploadEdits}>{labels.submit_edits}</button>
                </>
                :<></>}
        </div>        
        <table id = "authorTableWindow"><tbody>
            <tr className = "Header"><th>{name[0]}</th></tr>
            <tr>
                <td>{/*string of all other names of the person, should be replaced by hover list or similar*/}
                    {numNames>1?labels.aka + name.slice(1,numNames).join(", "):<></>}
                </td>
            </tr>
            <TableRow label = {" " + labels.nationality + " "}>
                {!edit?data.author_nationality:<input value={data.author_nationality} name = "author_nationality" onChange = {e => editInfo(e)}></input>}
            </TableRow>
            <TableRow label = {labels.born + " "}>
            {!edit?
                data.author_birth_year === null
                    ? labels.unspecified
                        :(data.author_birth_year>0
                            ?data.author_birth_year + " AD": Math.abs(data.author_birth_year) + " BC" )//If <0->BC else AD
                            :<input type="number" name = "author_birth_year" value = {data.author_birth_year} 
                                        onChange = {e => editInfo(e)}/>
                    }
                    {!edit
                        ? " " +checkStr(data.author_birth_city, data.author_birth_country)
                        :<>
                    <label style = {{paddingLeft:5}}>
                    {"("}
                        <input value = {data.author_birth_city} name = "author_birth_city" onChange = {e => editInfo(e)}></input>
                    </label>
                    <label>
                        <input value={data.author_birth_country} name = "author_birth_country" onChange = {e => editInfo(e)}></input>
                        {")"}
                    </label>{labels.edit_country_birth_description}
                    </>
                    }
            </TableRow>
            <TableRow label = {labels.died + " "}>
                {!edit
                    ?data.author_death_year===null
                        ?labels.unspecified
                        :(data.author_death_year>0?data.author_death_year + " AD": Math.abs(data.author_death_year) + " BC")
                    :<input value = {data.author_death_year} type = "number" name = "author_death_year" onChange = {e => editInfo(e)}></input>
                }
                {!edit
                    ?" " + checkStr(data.author_death_city, data.author_death_country, "")
                    :<>
                        <label style = {{paddingLeft: 5}}>{"("}
                            <input value = {data.author_death_city} name = "author_death_city" onChange = {e => editInfo(e)}></input>
                        </label>
                        <label>
                            <input value = {data.author_death_country} name = "author_death_country" onChange = {e => editInfo(e)}></input>)
                            {labels.edit_country_death_description}
                        </label>
                    </>  
                    }
            </TableRow>
                {!edit? (
                        (data.author_birth_year === null|data.author_death_year === null) && data.author_floruit !==null?
                        <TableRow label = {labels.floruit + " "}>
                            {" " + data.author_floruit}
                        </TableRow>
                    :<></>
                )
                    :<TableRow label = {labels.floruit + " "}>
                        <input value = {data.author_floruit} name = "author_floruit" onChange = {e => editInfo(e)}></input>
                    </TableRow>
                }
            <TableRow label = {labels.occupation + " "}>
                {mainOccupation}
                {occupationList.length>1?//Drop-down list of occupations if there are more than 1
                    ", " + labels.other_occupations + occupationList.slice(1,occupationList.length).join(", ")
                    :<></>
                }
            </TableRow>
            <TableRow>
                {typeof wiki !== Object && wiki !== ""? parse(wiki):<></>}
            </TableRow>
            <tr>{/*Placeholder for influences */}</tr>
            <tr>{/*Placeholder for influenced */}</tr>
            <AuthorTexts edit = {edit} author_id = {data.author_id}/>
            </tbody></table>
    </div>
    );
  }

  export default AuthorTable;