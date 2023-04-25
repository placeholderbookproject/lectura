import Select from 'react-select';
import 'react-select-search/style.css';
import {Navigate, Link} from 'react-router-dom'
import React, {useState, useEffect} from 'react';
import { Navbar, Container } from "react-bootstrap";
import labels from './labels.js'
import {fetchSearchResults} from './apiEffects.js'
import {AddNew} from './AddNew.js'
import LoginWindow from './Login.js'

const MainSearch = () => {
    const [enterSearch,setEnterSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [searchResults,setSearchResults] = useState();
    const [selectedValue, setSelectedValue] = useState();
    useEffect (()=> {setEnterSearch(false);},[enterSearch]);
    const searchSelect = (event) => {      
      setSelectedValue(event);
      setEnterSearch(true);
    }  
    const testSelect = (event) => {
      if (event.length>3){
        setQuery(event);
        fetchSearchResults({ setSearchResults, query})();
      }
    }
    return (
      <>
        <div style={{width: '500px', position:'relative', margin:'0 auto',clear: 'left', height:'auto',zIndex:0,}}>
          <Select 
            placeholder="Search for an author or text"
            options={searchResults}
            onInputChange={testSelect}
            onChange={searchSelect}
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      {(enterSearch) 
        ?<Navigate to={"/"+selectedValue.type+"/"+selectedValue.value}/>
        :(<></>)}
    </>
    )
}

const SiteHeader = () => {
  return (
      <Container className = "flexbox-container" 
          style={{backgroundColor: '#dedbdb', position: 'sticky', borderBottom: '1.5px solid #8a8a8a', top: 0,}}>
        <Navbar style = {{backgroundColor: '#dedbdb', paddingBottom: 5,paddingTop: 5,}}>{/*https://retool.com/blog/building-a-react-navbar/ */}
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/"}><button className="homeBtn">{labels.homeBtn}</button></Link>
            <MainSearch />
            <Link to = {"/search"} style={{paddingLeft: "1rem",paddingRight: "1rem"}}><button className="detailedSearchBtn">{labels.detailedSearchBtn}</button></Link>
            {/*<Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/import"}><button className="importBtn">{labels.importDataBtn}</button></Link>*/}
              {/*<AddNew label = "+"/>*/}
            {/*<Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/admin"}><button className="adminBtn">{labels.adminBtn}</button></Link>*/}
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/lists"}><button className="listsBtn">Lists</button></Link>
            {/*<LoginWindow/>*/}
       </Navbar>
      </Container>
  )
}

export default SiteHeader;