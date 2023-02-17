import React, {/*useRef,*/ useState, useEffect} from 'react';
import TableRow from './ViewRow.js';
import labels from './labels.js';
import AuthorTexts from './AuthorTexts.js';
import {searchWikipediaEffect, submitEdits} from './apiEffects.js';
import {checkStr, transformYear} from './formattingFuncs.js';
import EditWindow from './EditWindow.js';
const parse = require('html-react-parser');


const AuthorTable = (props) => {
    const [wiki, setWiki] = useState("");
    const [data, setData] = useState(props.author);
    const [edit,setEdit] = useState(false);
    const [editData, setEditData] = useState({'author_id':props.author.author_id});
    const name = data.author_name.split(",");
    const numNames = name.length;
    const occupationList = data.author_positions.split(", ");
    const mainOccupation = occupationList[0];
    useEffect(() => {setData(props.author)},[props.author])
    useEffect (searchWikipediaEffect({setWiki, edit, name:name[0], mainOccupation}),[name,mainOccupation, edit, props.author.author_id])
    useEffect(() => {setEditData({'author_id':props.author.author_id})},[props.author.author_id])
    const setEditWindow = () => {
        if (!edit) {setEdit(true)}
        else{setEdit(false)}
    }
    const editInfo = (e) => {
        const {value, name} = e.target
        const oldEdit = editData
        let newData = data
        newData[name] = value
        setEditData({...oldEdit, [name]:value})
        setData({...data,[name]:value})
    }
    const resetEdit = () => {
        setData(props.author)
        setEditData({'author_id':props.author.author_id})
    }
    return (
    <div>
        <EditWindow id={props.author.author_id} editData = {editData} setEdit = {setEdit} setEditWindow = {setEditWindow}
            resetEdit = {resetEdit} data = {props.author} edit = {edit} type = "authors" submitEdits = {submitEdits}/>        
        <table id = "authorTableWindow"><tbody>
            <tr className = "Header"><th>{name[0]}</th></tr>
            <tr>
                <td>{numNames>1?labels.aka + name.slice(1,numNames).join(", "):<></>}</td>
            </tr>
            <TableRow label = {" " + labels.nationality + " "}>
                {!edit?data.author_nationality:<input value={data.author_nationality} name = "author_nationality" onChange = {e => editInfo(e)}/>}
            </TableRow>
            <TableRow label = {labels.born + " "}>
                {!edit
                    ?transformYear(data.author_birth_year, labels.unspecified)
                    :<input type="number" name = "author_birth_year" value = {data.author_birth_year} onChange = {e => editInfo(e)}/>
                }
                {!edit
                    ?" " +checkStr(data.author_birth_city, data.author_birth_country, "")
                    :<>
                <label style = {{paddingLeft:5}}>
                {"("}
                    <input value = {data.author_birth_city} name = "author_birth_city" onChange = {e => editInfo(e)}/>
                </label>
                <label>
                    <input value={data.author_birth_country} name = "author_birth_country" onChange = {e => editInfo(e)}/>
                    {")"}
                </label>{labels.edit_country_birth_description}
                </>
                }
            </TableRow>
            <TableRow label = {labels.died + " "}>
                {!edit
                    ?transformYear(data.author_death_year, labels.unspecified)
                    :<input value = {data.author_death_year} type = "number" name = "author_death_year" onChange = {e => editInfo(e)}/>
                }
                {!edit
                    ?" " + checkStr(data.author_death_city, data.author_death_country, "")
                    :<>
                        <label style = {{paddingLeft: 5}}>{"("}
                            <input value = {data.author_death_city} name = "author_death_city" onChange = {e => editInfo(e)}/>
                        </label>
                        <label>
                            <input value = {data.author_death_country} name = "author_death_country" onChange = {e => editInfo(e)}/>)
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
                {occupationList.length>1
                    ?", " + labels.other_occupations + occupationList.slice(1,occupationList.length).join(", ")
                    :<></>}
            </TableRow>
            <TableRow> {typeof wiki !== Object && wiki !== ""? parse(wiki):<></>}</TableRow>
            <AuthorTexts edit = {edit} author_id = {data.author_id}/>
            </tbody></table>
    </div>
    );
  }

  export default AuthorTable;