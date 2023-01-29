import './App.css';
import SearchDetailed from './views/Search.js';
import AuthorTable from './views/AuthorTable.js';
import authorData from './data/main_data.js';
import React, {useState, useEffect} from 'react';
import TextField from "@mui/material/TextField";
import Select from 'react-select';
import 'react-select-search/style.css';
import { BrowserRouter, Route, Routes/*, Link*/, Navigate, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

//Use bootstrap?

//Options for language dropdown
/*const languageOptions = [
  {label: 'English', value: 'en'},
];
*/
let listOfAuthors = authorData();

function MainSearch() {
  let [search, setSearch] = useState("");
  let [select, setSelect] = useState(false);
  let [results,setResults] = useState(listOfAuthors.slice(1,1));
  let [enterSearch,setEnterSearch] = useState(false);

  useEffect (()=> {
    setEnterSearch(false);
  });
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
      //fullwidth
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

function AuthorLinks () {
  const data = listOfAuthors.map((author) => 
    <Route path={"/author/"+author.id} element={
      <AuthorTable data={author}/>} key = {author.id}>
  </Route>)
  return (
    <Routes>
    {data}
    </Routes>)
    
  };


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDummies: {select: false, authorView: false, bookView: false},
      language: "en",
  }
  };
    
  returnHome = event => {//Remove all windows
    var newShowDummies = this.state.showDummies;
    const keys = Object.keys(newShowDummies);
    for (var n in keys) {newShowDummies[keys[n]] = false};
    this.setState({showDummies:newShowDummies});
    window.location.href="/";
  }

  render() {
  return (
    
    <div>
      <BrowserRouter>
        <div className = "siteHeader">
            <button id = "homeBtn" onClick={()=> this.returnHome()}>{"Home"}</button>
            <button id = "searchDetailBtn">{"Detailed search"}</button>
            <button id = "languageChoice">{this.state.language}</button>
      </div>
      <MainSearch/>
      <AuthorLinks/>
      </BrowserRouter>
    </div>
  );
}
}

export default App;
