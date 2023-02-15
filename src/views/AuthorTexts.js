import React, {/*useRef,*/ useState, useEffect} from 'react';
import labels from './labels.js';
import {Link} from 'react-router-dom';
import Select from 'react-select';


const TextRow = (props) => {
    return (
        <tr>
            <td>
                <Link to={"/text/"+props.data.text_id}>{props.data.label}</Link>
            </td>
        </tr>
    )
}

const AuthorTexts = (props) => {
    const edit = props.edit;
    const [textsData,setTextsData] = useState(props.data);
    const [searchResults, setSearchResults] = useState();
    const [query, setQuery] = useState("");
    useEffect (() => {
        setTextsData(props.data)
    },[props.data])

    useEffect (()=> {
        const fetchData = () => {
          const requestOptions = {
              method: 'GET',
                      };
          fetch('http://127.0.0.1:8000/search?query='+query+"&type=texts", requestOptions)
          .then(response => {
              if (response.ok) {
              return response.json()
              }
              throw response;
          })
          .then (data => 
            {setSearchResults(data["texts"])
          })
        }
      query.length>3?fetchData():void(0);
      },[query])  
    const addWork = () => {
        const addWork = {text_id: '',label: 'New row'}
        setTextsData([...textsData, addWork])
    }
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
                <td>
                    {typeof textsData !== Object && textsData !== ""?labels.works:labels.worksUnknown}
                </td>
            </tr>
        {!edit
            ?(typeof textsData !== Object && textsData !== "") ? (textsData.map((work) => (<TextRow key={work.text_id} data={work}/>))):<></>
            :textsData !== ""?
                textsData.map( (work) => 
                    <tr key = {textsData.indexOf(work)}>
                        <td style = {{display:'inline-flex'}}>
                            <Select style = {{width: 300}}
                                placeholder={work.label?work.label:"find a book in the system"}
                                options = {typeof searchResults === 'object'?(searchResults):void(0)}
                                onInputChange = {selectQuery}
                                onChange = {(e) => searchSelect (e,textsData.indexOf(work))}
                                getOptionLabel ={(option)=>option.title+" - "+option.author}
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