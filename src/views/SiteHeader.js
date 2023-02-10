import Select from 'react-select';
import 'react-select-search/style.css';
import {Navigate, Link} from 'react-router-dom'
import React, {useState, useEffect} from 'react';
import { Navbar, /*Nav, NavDropdown,*/ Container } from "react-bootstrap";


const MainSearch = (props) => {
    /*
      Component consisting of a search, a short description of search results and a select list of all results
    */
    const [results,setResults] = useState(props.data.texts.slice(1,1)); //
    const [enterSearch,setEnterSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [APIResults,setAPIResults] = useState();
    //const [loading, setLoading] = useState(false);
    useEffect (()=> {
      setEnterSearch(false);
    },[enterSearch]);
    useEffect (()=> {
      const fetchData = () => {
        const requestOptions = {
            method: 'GET',
                    };
        fetch('http://127.0.0.1:8000/search?query='+query, requestOptions)
        .then(response => {
            if (response.ok) {
            return response.json()
            }
            throw response;
        })
        .then (data => 
          {const final_data = (data["texts"].concat(data["authors"], data["editions"]))
          setAPIResults(
            final_data.length>100?
            final_data.slice(0,100):
            final_data.slice(0,100)
          )
        }
            )
        //.finally( () => setLoading(false))
        }
    query.length>3?fetchData():console.log("search is not long enough")
    },[query])

    const searchSelect = (event) => {
      const selectedValue = event;
      setResults([selectedValue]);
      setEnterSearch(true);
    }  
    const testSelect = (event) => {
      const query = event;
      if (query.length>3){
        setQuery(query);
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
            options={
              typeof APIResults === 'object'?(APIResults):results
              }
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