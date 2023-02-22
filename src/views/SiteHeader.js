import Select from 'react-select';
import 'react-select-search/style.css';
import {Navigate, Link} from 'react-router-dom'
import React, {useState, useEffect} from 'react';
import { Navbar, Container } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import labels from './labels.js'
import {fetchSearchResults} from './apiEffects.js'
import {AddNew} from './AddNew.js'
import DropdownItem from 'react-bootstrap/esm/DropdownItem.js';

const MainSearch = (props) => {
    const [enterSearch,setEnterSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [APIResults,setAPIResults] = useState();
    const [selectedValue, setSelectedValue] = useState();
    useEffect (()=> {setEnterSearch(false);},[enterSearch]);
    useEffect (fetchSearchResults({setSearchResults:setAPIResults,query}),[query])
    const searchSelect = (event) => {      
      setSelectedValue(event);
      setEnterSearch(true);
    }  
    const testSelect = (event) => {if (event.length>3){setQuery(event);}}
    return (
      <>
        <div style={{width: '500px', position:'relative', margin:'0 auto',clear: 'left', height:'auto',zIndex:0,}}>
          <Select 
            placeholder="Search for an author or text"
            options={APIResults!==undefined?(APIResults):props.data.texts.slice(1,1)}
            onInputChange={testSelect}
            onChange={searchSelect}
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            getOptionValue = {(option) =>
                (option.edition_id===undefined)
                  ?option.text_id === undefined
                    ?option.author_id:option.text_id
                    :option.edition_id
                    }
          />
        </div>
      {(enterSearch) 
        ?<Navigate to={(selectedValue.author_id !== undefined && selectedValue.text_id===undefined) 
                        ?("/author/"+selectedValue.author_id):("/text/"+selectedValue.text_id)}
          />
        :(<></>)}
    </>
    )
}

const SiteHeader = (props) => {
  return (
      <Container className = "flexbox-container" 
          style={{backgroundColor: '#dedbdb', position: 'sticky', borderBottom: '1.5px solid #8a8a8a', top: 0,}}>
        <Navbar style = {{backgroundColor: '#dedbdb', paddingBottom: 5,paddingTop: 5,}}>{/*https://retool.com/blog/building-a-react-navbar/ */}
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/"}><button className="homeBtn">{labels.homeBtn}</button></Link>
            <MainSearch data = {props.data}/>
            <Link to = {"/search"} style={{paddingLeft: "1rem",paddingRight: "1rem"}}><button className="detailedSearchBtn">{labels.detailedSearchBtn}</button></Link>
              <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/import"}><button className="importBtn">{labels.importDataBtn}</button></Link>{/*className="importBtn"*/}
              <AddNew label = "+"/>
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/admin"}><button className="adminBtn">{labels.adminBtn}</button></Link>
       </Navbar>
      </Container>
  )
}

export default SiteHeader;