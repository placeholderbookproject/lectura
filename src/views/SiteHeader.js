import Select from 'react-select';
import 'react-select-search/style.css';
import {Navigate, Link} from 'react-router-dom'
import React, {useState, useEffect} from 'react';
import { Navbar, Nav, /*NavDropdown,*/ Container } from "react-bootstrap";

/*const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted orange',
    color: 'black',
    padding: 20,
  }),
  menuPortal: (provided) => ({
    ...provided,
    backgroundColor:'black',
    width: 200,
    borderBottom: '1px dotted orange',
  }
  ),
  control: () => ({
    width: 200,
  }),
  singleValue: (provided, state) => {
    const opacity = 1;
    const transition = 'opacity 350ms';

    return { ...provided, opacity, transition };
  }
}*/

function MainSearch(props) {
    /*
      Component consisting of a search, a short description of search results and a select list of all results
    */
    let [results,setResults] = useState(props.data.listOfAuthors.slice(1,1)); //
    let [enterSearch,setEnterSearch] = useState(false);
  
    useEffect (()=> {
      setEnterSearch(false);
    },[enterSearch]);
    function searchFunction (search) {
          /*Function finds and sets search results based on the search using the filter function:
              For every element in the search, 
              a) find a match in the author data using a combination of author name, position, country and city
              b) find a match in the text data using a combination of title and author
          */ 
        var authors = props.data.listOfAuthors, works = props.data.listOfWorks;
        search = search.toLowerCase().split(" ");
        for (let i = 0; i<search.length;i++){ 
          const searchElement = search[i];
          authors = authors.filter(
          e=> 
          (e.name+e.position+e.country+e.city).toLowerCase()
          .includes(searchElement)
          )
          //console.log(authors)
          works = works.filter(
            e=>
            (e.title+e.author).toLowerCase().includes(searchElement)
          )
        }
        setResults(authors.concat(works))
    }
    function searchSelect (event) {
      const selectedValue = event;
//      setSelect(false);
      setResults([selectedValue]);
      setEnterSearch(true);
    }  
    function testSelect(event) {
      const query = event
      if (query.length>3){
        searchFunction(query);
      }
    }
    return (
      <>
        <Link style={{margin: "1rem",textDecoration: "none",color: 'blue'}} to = {"/"}><button>Home</button></Link>
        <Link to = {"/search"}><button>Detailed search</button></Link>
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
          {(results[0].type === "author") ? ("/author/"+results[0].id): ("/work/"+results[0].id)}
        />):
        (<></>)
      }
    </>
    )
  }

function SiteHeader(props) {
return (
    <Container className = "flexbox-container">
      <Navbar fixed="top">{/*https://retool.com/blog/building-a-react-navbar/ */}
            <MainSearch data = {props.data}/>
      </Navbar>
    </Container>
)
}


export default SiteHeader;