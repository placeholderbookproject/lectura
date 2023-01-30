import './App.css';
//import SearchDetailed from './views/Search.js';
import AuthorTable from './views/AuthorTable.js';
import TextTable from './views/TextTable.js';
import authorData from './data/main_data.js';
import React, {useState, useEffect} from 'react';
import TextField from "@mui/material/TextField";
import Select from 'react-select';
import 'react-select-search/style.css';
import { BrowserRouter, Route, Routes/*, Link*/, Navigate} from 'react-router-dom';
import { Navbar, Nav, /*NavDropdown,*/ Container } from "react-bootstrap";

//Use bootstrap?

//Options for language dropdown
/*const languageOptions = [
  {label: 'English', value: 'en'},
];
*/
let listOfAuthors = authorData()["authors"];
let listOfWorks = authorData()["work"];

function MainSearch() {
  let [search, setSearch] = useState("");
  let [select, setSelect] = useState(false);
  let [results,setResults] = useState(listOfAuthors.slice(1,1));
  let [enterSearch,setEnterSearch] = useState(false);

  useEffect (()=> {
    setEnterSearch(false);
  },[enterSearch]);
  //let [link,setLink] = "";
  function searchFunction (search) {
      var data = listOfAuthors;
      search = search.toLowerCase();
      search = search.split(" ")
      for (let i = 0; i<search.length;i++){ 
        //For every element in the search, find a match in the data using a combination of author name, position, country and city
        data = data.filter(
        e=> 
        (e.name+e.position+e.country+e.city).toLowerCase()
        .includes(search[i])
        )}
      setResults(data)
  }
  function searchSelect (event) {
    const selectedValue = event;
    setSelect(false);
    setResults([selectedValue]);
    setEnterSearch(true);
    //setLink("/author/"+selectedValue.id);
  }  

  return (
    <div>
      <TextField //Search field
      className = "searchText"
      id="outlined-basic"
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
      label="Search for a person or a text"
    />
    {"# search results: " + results.length}
    {(select) ? //Show select window if there is a search
      (<Select options={results} onChange={searchSelect}
          />):(<div></div>)}
    {(enterSearch) ? 
      (<Navigate to={"/author/"+results[0].id}/>):
      (<div/>)
    }
  </div>
  )
}

function SiteHeader() {
  return (
    <Container className = "flexbox-container">
    <Navbar>
      <Navbar.Brand href={"/"}>Lectura</Navbar.Brand>
      <Nav>
        <MainSearch/>
      </Nav>
    </Navbar>
    </Container>
  )
}

function App () {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path = {"/"} element = {<SiteHeader/>}/>
        {listOfWorks.map((work) =>
          <Route path ={"/work/"+work.id} element = {
            <div>
              <MainSearch/>
              <TextTable data={work}/>
            </div>
          } key = {work.id}/>
        )}
        {listOfAuthors.map((author) => 
          <Route path={"/author/"+author.id} element={ //Adds a link for every author
            <div>
            <MainSearch/>
            <AuthorTable data={author}/>
            </div>
            } key = {author.id}>
          </Route>)}
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
