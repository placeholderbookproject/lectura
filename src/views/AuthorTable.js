import React, {/*useRef,*/ useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import TableRow from './ViewRow.js'
import labels from './labels.js'
const parse = require('html-react-parser');
//import Collapsible from './Collapsible.js';

const TextRow = (props) => {
    let publication = props.data.publication
    publication>0?publication = publication + " AD": publication!== ""? publication = Math.abs(publication) + " BC": publication = "not specified"
    return (
        <tr>
            <td>
                <Link to={"/text/"+props.data.index}>{props.data.title + " (" + publication + ")"}</Link>
            </td>
        </tr>
    )
}

const AuthorTable = (props) => {
    const tableLabels = labels;
    let texts = props.data.texts;
    if (texts === null) {texts = []};
    const [wiki, setWiki] = useState("");
    const [data, setData] = useState(props.data);
    const [edit,setEdit] = useState(false);
    const name = data.name.split(",");
    const numNames = name.length;
    const occupationList = data.position.split(", ");
    const firstOccupation = occupationList[0].split(" ");
    const mainOccupation = occupationList[0];//(firstOccupation.length>1)?firstOccupation.splice(1,firstOccupation.length).join(" "):occupationList[0];
    const nationality = firstOccupation[0];
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
        fetch('http://127.0.0.1:8000/edit?type=authors&id='+data.id, requestOptions)
            .then(response => response.json())
            .finally(() => setEdit(false))
    }

    const editInfo = (e) => {
        const {value, name} = e.target
        let newData = data
        newData[name] = value
        setData({...data,[name]:value})
    }
    const undoEdit = () => {
        setData(props.data)
    }
    return (
    <div>
        <button onClick = {setEditWindow}>{!edit?tableLabels.editBtn:tableLabels.exitEditBtn}</button>
        {edit?
            <>
                <button onClick = {undoEdit}>{tableLabels.undoEditBtn}</button>
                <button onClick = {uploadEdits}>{tableLabels.submit_edits}</button>
            </>
            :<></>}
        <table id = "authorTableWindow"><tbody>
            <tr className = "Header">
                <th>{name[0]}</th>
            </tr>
            <tr>
                <td>{/*string of all other names of the person, should be replaced by hover list or similar*/}
                    {numNames>1?tableLabels.aka + name.slice(1,numNames).join(", "):<></>}
                </td>
            </tr>
            <TableRow label = {" " + tableLabels.nationality + " "}>
                {!edit?nationality:<input value={data.nationality} name = "nationality" onChange = {e => editInfo(e)}></input>}
            </TableRow>
            <TableRow label = {tableLabels.born + " "}>
            {!edit?
                data.birth === ""? tableLabels.unspecified://If no birth -> not specified
                                    (data.birth>0?data.birth + " AD": Math.abs(data.birth) + " BC" )//If <0->BC else AD
                    :<input type="number" name = "birth" value = {data.birth} onChange = {e => editInfo(e)}></input>
                    }
                    {!edit?(data.city === "" && data.country === "")?"":" ("+data.city+((data.city.length>0&&data.country.length>0)?
                        ", ":"")+data.country + ") " 
                    //If neither country or city of birth exists -> empty string
                    :<>
                    <label style = {{paddingLeft:5}}>
                    {"("}
                        <input value = {data.city} name = "city" onChange = {e => editInfo(e)}></input>
                    </label>
                    <label>
                        <input value={data.country} name = "country" onChange = {e => editInfo(e)}></input>
                        {")"}
                    </label>{tableLabels.edit_country_birth_description}
                    </>
                    }
            </TableRow>
            <TableRow label = {tableLabels.died + " "}>
                {!edit?
                    data.death===""? tableLabels.unspecified:(data.death>0?data.death + " AD": Math.abs(data.death) + " BC")
                    :<input value = {data.death} type = "number" name = "death" onChange = {e => editInfo(e)}></input>
                }
                {!edit?
                    (data.city_death === "" && data.country_death === "")?"": " (" + data.city_death + (data.country_death.length>0?", ": "") + data.country_death + ")"
                :<>
                    <label style = {{paddingLeft: 5}}>{"("}
                        <input value = {data.city_death} name = "city_death" onChange = {e => editInfo(e)}></input>
                    </label>
                    <label>
                        <input value = {data.country_death} name = "country_death" onChange = {e => editInfo(e)}></input>
                        {tableLabels.edit_country_death_description}
                    </label>
                </>  
                    }
            </TableRow>
                {!edit? (
                        (data.birth === ("")|data.death === ("")) && data.floruit !==("")?
                        <TableRow label = {tableLabels.floruit + " "}>
                            {" " + data.floruit}
                        </TableRow>
                    :<></>
                )
                    :<TableRow label = {tableLabels.floruit + " "}>
                        <input value = {data.floruit} name = "floruit" onChange = {e => editInfo(e)}></input>
                    </TableRow>
                }
            <TableRow label = {tableLabels.occupation + " "}>
                {//edit?<input value = {mainOccupation}></input>:
                mainOccupation
                }
                {occupationList.length>1?//Drop-down list of occupations if there are more than 1
                    ", " + tableLabels.other_occupations + occupationList.slice(1,occupationList.length).join(", ")
                    :<></>
                }
            </TableRow>
            <TableRow>
                {typeof wiki !== Object && wiki !== ""? parse(wiki):<></>}
            </TableRow>
            <tr>{/*Placeholder for biography */}</tr>
            <tr>{/*Placeholder for influences */}</tr>
            <tr>{/*Placeholder for influenced */}</tr>
            <tr className = "Works" style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
                <td>{tableLabels.works}</td>
            </tr>
                {(texts.length>0) ? (texts.map((text) => (<TextRow key={text.index} data={text}/>))):<></>}
            </tbody></table>
    </div>
    );
  }

  export default AuthorTable;