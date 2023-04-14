import React, {/*useRef,*/ useState, useEffect} from 'react';
import labels from './labels.js';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import {fetchDataEffect, fetchSearchResults} from './apiEffects.js'

const TextRow = (props) => {
    return (
        <tr><td>
                {props.data.text_id !== ""?<Link to={"/text/"+props.data.text_id}>{props.data.label}</Link>:props.data.label}
        </td></tr>
    )
}

const AuthorTexts = (props) => {
    const edit = props.edit;
    const [textsData,setTextsData] = useState([]);
    const [searchResults, setSearchResults] = useState();
    const [query, setQuery] = useState("");
    useEffect (fetchDataEffect({setData:setTextsData, id:props.author_id, type:'texts'}),[props.author_id])
    useEffect (fetchSearchResults({setSearchResults,query, type:"texts"}),[query])  
    const addWork = () => {setTextsData([...textsData, {text_id: '',label: 'New row'}])}
    const removeWork = (e,id) => {
        const oldWorks = textsData;
        let newWorks = []   
        for (let i = 0; i<oldWorks.length;i++){
            if (i === id){continue}
            else {newWorks.push(oldWorks[i])}
        }
        setTextsData(newWorks)
    }
    const selectQuery = (event) => {
        const query = event;
        if (query.length>3){setQuery(query);}
      }  
      const searchSelect = (event, id) => {      
        let oldWorks = textsData;
        oldWorks[id] = event
        setTextsData(oldWorks)
      }    
    return (
        <>
            <tr className = "Works" style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
                <td>{typeof textsData !== Object && textsData !== ""?labels.works:labels.worksUnknown}</td>
            </tr>
        {!edit
            ?(typeof textsData !== Object && textsData !== "") 
                ?(textsData.map((work) => (<TextRow key={work.text_id} data={work}/>))):<></>
            :textsData !== ""
                ?textsData.map((work) => 
                    <tr key = {textsData.indexOf(work)}>
                        <td style = {{display:'inline-flex'}}>
                            <Select style = {{width: 300}}
                                placeholder={work.label?work.label:"find a book in the system"}
                                options = {typeof searchResults === 'object'?(searchResults):void(0)}
                                onInputChange = {selectQuery}
                                onChange = {(e) => searchSelect (e,textsData.indexOf(work))}
                            />
                            <button onClick = {(e) => removeWork(e,textsData.indexOf(work))}>X</button>
                        </td>
                    </tr>)
                :<></>}
        {edit?<tr><td><button onClick = {addWork}>+</button></td></tr>:<></>}            
        </>
    )
}

export default AuthorTexts