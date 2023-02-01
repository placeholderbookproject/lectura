import Select from 'react-select';
import 'react-select-search/style.css';
import {Navigate, Link} from 'react-router-dom'
import TextField from "@mui/material/TextField";
import React, {useState, useEffect} from 'react';
import { Navbar, Nav, /*NavDropdown,*/ Container } from "react-bootstrap";

function MainSearch(props) {
    /*
      Component consisting of a search, a short description of search results and a select list of all results
    */
    let [search, setSearch] = useState(""); //Main search
    let [select, setSelect] = useState(false); //Checks if a specific site has been selected
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
          authors = authors.filter(
          e=> 
          (e.name+e.position+e.country+e.city).toLowerCase()
          .includes(search[i])
          )
          works = works.filter(
            e=>
            (e.title+e.author).toLowerCase().includes(search[i])
          )
        }
        setResults(authors.concat(works))
    }
    function searchSelect (event) {
      const selectedValue = event;
      setSelect(false);
      setResults([selectedValue]);
      setEnterSearch(true);
    }  
  
    return (
      <>
        <Link style={{margin: "1rem",textDecoration: "none",color: 'blue'}} to = {"/"}><button>Home</button></Link>
        <TextField //Search field https://mui.com/material-ui/react-text-field/ //https://mui.com/material-ui/api/input-base/ //https://m2.material.io/components/text-fields#anatomy
        className = "searchText"
        id="outlined-basic"
        inputProps={{style: 
                {fontSize: 20,
                height: 10}
                }}
        onChange={e => {
          setSearch(e.target.value); //set new search value
          searchFunction(search); //Searches for author using new search value
          if(search.length>0){setSelect(true);}
          setEnterSearch(false);
          }}
        /*onKeyDown={e => {if (e.key === "Enter")
                  {
                  window.location.href="/search?q="+this.state.search;
                  //<Navigate to={"/search?q="+this.state.search}/>;
                  console.log("Search has been entered");
                  }
                  }}*/
        variant="outlined"
        label="Search"
        placeholder={"Search"}
        helperText = {"# search results: " + results.length}
      />
      <Link to = {"/search"}><button>Detailed search</button></Link>
      {(select) ? //Show select window if there is a search
        (<Select options={results} onChange={searchSelect}
            />):(<></>)}
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
    <Navbar fixed="top">
    <Nav>
        <MainSearch data = {props.data}/>
    </Nav>
    </Navbar>
    </Container>
)
}


export default SiteHeader;