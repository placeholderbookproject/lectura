import Select from 'react-select';
import 'react-select-search/style.css';
import {Navigate, Link} from 'react-router-dom'
import React, {useState, useEffect} from 'react';
import { Navbar, /*Nav, NavDropdown,*/ Container } from "react-bootstrap";


const MainSearch = (props) => {
    /*
      Component consisting of a search, a short description of search results and a select list of all results
    */
    let [results,setResults] = useState(props.data.texts.slice(1,1)); //
    let [enterSearch,setEnterSearch] = useState(false);
    useEffect (()=> {
      setEnterSearch(false);
    },[enterSearch]);
    const searchFunction = (search) => {
          /*Function finds and sets search results based on the search using the filter function:
              For every element in the search, 
              a) find a match in the author data using a combination of author name, position, country and city
              b) find a match in the text data using a combination of title and author
          */ 
        let authors = props.data.authors, texts = props.data.texts;
        search = search.toLowerCase().split(" ");
        for (let i = 0; i<search.length;i++){ 
          const searchElement = search[i];
          authors = authors.filter(
          e=> 
          (e.name+e.position+e.country+e.city).toLowerCase()
         .includes(searchElement)
          )
          texts = texts.filter(
            e=>
            (e.title+e.author).toLowerCase().includes(searchElement)
          )
        }
        setResults(authors.concat(texts))
    }
    const searchSelect = (event) => {
      const selectedValue = event;
      setResults([selectedValue]);
      setEnterSearch(true);
    }  
    const testSelect = (event) => {
      const query = event
      if (query.length>3){
        searchFunction(query);
      }
    }
    return (
      <>
        <div style={{
          width: '500px',
          position:'relative',
          margin:'0 auto',
          clear: 'left',
          height:'auto',
          zIndex:0,
          }}>
          <Select 
            placeholder="Search for an author or text"
            options={results.length>100? results.slice(0,100):results}
            onInputChange={testSelect}
            onChange={searchSelect}
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      {(enterSearch) ? 
        (<Navigate to=
          {(results[0].type === "author") ? ("/author/"+results[0].id): ("/text/"+results[0].id)}
        />):
        (<></>)
      }
    </>
    )
  }

const SiteHeader = (props) => {
  return (
      <Container className = "flexbox-container" 
          style={{backgroundColor: '#4c7557',
                  borderBottom: '1px solid #8a8a8a',
                  position: 'sticky',
                  top: 0,
                  }}
          >
        <Navbar style = {{backgroundColor: '#4c7557',
                          paddingBottom: 5,
                          }}>{/*https://retool.com/blog/building-a-react-navbar/ */}
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/"}><button className="homeBtn">Home</button></Link>
            <MainSearch data = {props.data}/>
            <Link to = {"/search"} style={{paddingLeft: "1rem",paddingRight: "1rem"}}><button className="detailedSearchBtn">Detailed search</button></Link>
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/import"}><button className="importBtn">Import data</button></Link>
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/admin"}><button className="adminBtn">Admin</button></Link>
        </Navbar>
      </Container>
  )
}

export default SiteHeader;