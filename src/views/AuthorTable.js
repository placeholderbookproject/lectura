import React, {/*useRef,*/ useState, useEffect} from 'react';
import TableRow from './ViewRow.js';
import labels from './labels.js';
import AuthorTexts from './AuthorTexts.js'
const parse = require('html-react-parser');
//import Collapsible from './Collapsible.js';

const fetchDataEffect = props => () => {
    fetch('http://127.0.0.1:8000/data?type=texts&id='+props.author_id)
    .then(response => {if(response.ok) {return response.json()}throw response})
    .then(results => {props.setData({...props.data,[props.addText]:results})}
    )
}

const AuthorTable = (props) => {
    const [wiki, setWiki] = useState("");
    const [data, setData] = useState(props.data);
    const [edit,setEdit] = useState(false);
    const addText = "texts"
    const name = data.author_name.split(",");
    const numNames = name.length;
    const occupationList = data.author_positions.split(", ");
    const mainOccupation = occupationList[0];//(firstOccupation.length>1)?firstOccupation.splice(1,firstOccupation.length).join(" "):occupationList[0];
    useEffect( fetchDataEffect({data: data, setData: setData, author_id: data.author_id, addText: addText}),[])
    useEffect(() => {
        setData(props.data)
    },[props.data]
    )
    useEffect ( () => {
        async function searchWikipedia() {
            const searchQuery = name[0]+ " " + mainOccupation;
            const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
            const response = await fetch(endpoint);
            if (!response.ok) {throw Error(response.statusText);}
            const json = await response.json();
            const title = json["query"]["search"][0]["title"]//["query"]//["search"][0]
            //const extractText = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exlimit=20&titles=${title}&explaintext=1&exsectionformat=plain`;
            const extractText = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
            const responseTwo = await fetch(extractText)
            if (!responseTwo.ok) {throw Error(responseTwo.statusText);}
            const result = await responseTwo.json();
            const url = result["content_urls"]["desktop"]["page"]
            console.log(json)
            return setWiki(result["extract"] + " (source: <a href = '" + url + "'>wikipedia</a>)");//return json;
          }
        !edit?
        searchWikipedia():void(0);
    },[name,mainOccupation, edit]
    )
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
            <tr className = "Header">
                <th>
                    {name[0]}
                </th>
            </tr>
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
                        ?(data.author_birth_city !== null || data.author_birth_country !== null) //need to fix later..
                            ?"("+(data.author_birth_city !== null)?data.author_birth_city:""
                                +(data.author_birth_country!==null)?", "+data.author_birth_country+")":")"
                            :""
                    //If neither country or city of birth exists -> empty string
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
                {!edit?
                    data.author_death_year===null
                        ?labels.unspecified:(data.author_death_year>0?data.author_death_year + " AD"
                            :Math.abs(data.author_death_year) + " BC")
                        :<input value = {data.author_death_year} type = "number" name = "author_death_year" onChange = {e => editInfo(e)}></input>
                }
                {!edit?
                    (data.author_death_city === null && data.author_death_country === null)
                        ?"": " (" + data.author_death_city + (data.author_death_country.length>0?", ": "") + data.author_death_country + ")"
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
            <AuthorTexts data = {data.texts} edit = {edit}/>
            </tbody></table>
    </div>
    );
  }

  export default AuthorTable;