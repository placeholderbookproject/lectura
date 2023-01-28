import './App.css';
import React from 'react';
import TextField from "@mui/material/TextField";
import Select from 'react-select';
import 'react-select-search/style.css';
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom';


let data = require('./data.json')
//Translate author table
function authorToDict(data) {
  function transferToDict(id) {
    var dictionary = data['data'][id];
    var id_int = parseInt(id)+1
    var birth = dictionary['Birth'];
    var death = dictionary['Death'];
    var deathString
    if (death<0) {deathString= Math.abs(death)+" BC"}
    else{deathString = death+ " AD"}    
    return {
      id:id_int,
      name: dictionary['Name'],
      position: checkNull(dictionary['Position']),
      birth: checkNull(birth),
      death: checkNull(death),
      floruit: checkNull(dictionary['Floruit']),
      country: checkNull(dictionary['Country']),
      city: checkNull(dictionary['City/Region']),
      label: "#"+id_int+": "+dictionary.Name.split(",")[0] + " - " + dictionary.Position +
      " ("+Math.abs(birth)+"-"+deathString/*+", fl. " + author.floruit*/+ ") (author)",
      value:id_int,
      deathString:deathString,
    }
}
  var list = [];
  for (var n in data['data']) {list.push(transferToDict(n))}
  return list
}
let listOfAuthors = authorToDict(data)

//translate nulls to unknown
function checkNull(data){
  if(data === null) {data = "unknown"}
  return data}

//Options for language dropdown
const languageOptions = [
  {label: 'English', value: 'en'},
  
];


/*Building a frame for an author:
  Author name tr -> later a popdown
  Birth & Location tr 
  Death tr
  (floruit if birth/death does not exist)
  Position tr
  BOOK COMPONENT
*/

function AuthorTable (props){
  //Creates the author "view"
  const author = props.data;
  var name = author.name.split(",");
  var floruit = "";
  if ((author.birth === ("unknown")|author.death === ("unknown")) && author.floruit !==("unknown")) {floruit = "floruit: " + author.floruit}
  var aka = "";
  var numNames = name.length;
  if (numNames > 1){aka = "aka. "+name.slice(1,numNames).join(", ")}
  return (
    (<table id = "authorTableWindow"><tbody>
      <tr className = "Header"><td>{name[0]}</td></tr>
      <tr><td>{aka}</td></tr>
      <tr>
        <td>{"born: " +author.birth+" ("+author.city+", "+author.country + ")"}</td>
      </tr>
      <tr><td>{"died: "+author.death}</td></tr>
      <tr><td>{floruit}</td></tr>
      <tr><td>{""}</td></tr>
      <tr><td>{author.position}</td></tr>
      <tr><td>{"For biographical details, see google "}<a href = {"https://www.google.com/search?q="+name[0]}>here</a></td>
        </tr>
      <tr className = {"Works"}><td>{"List of known works"}</td></tr>
      </tbody></table>
    )
  );
}

function TextTable (props){
  const text = props.data;
  const title = text.title.split(",");
  const numTitles = title.length;
  var aka = "";
  if(numTitles>1){aka = "aka. " + title.slice(1,numTitles).join(", ")};
  return (
    (
      <div>
      <table>
        <h1>{title[0]+ " (" + text.type + ")"}</h1>
          <h3>{aka}</h3>
          <h3>{text.publication + " (placeholder publication place, country)"}</h3>
          <h3>{text.language}</h3>
          <h3>{text.genre}</h3>
          <h3>{text.description}</h3>
      </table>
      <h1>{"Editions"}</h1>{/*mapping of editions*/}
      </div>
    )
  )
}

function SearchDetailed(props) {//Add the table view of 
  var search = props.data.search;
  var data = listOfAuthors;
  //List of options with label and options from these options
  //search field + clickable dropdown of variables to search through
  return (
    <div>
      <div>
        <TextField/>
        <button>{"placeholder for filter options"/*should be changed to dynamic select list*/}</button>
      </div>
      <div>
        <table>
        <tbody>
          <tr>
            <td>Author/Title</td>
            <td>Type</td>
            </tr>
        </tbody>
        </table>
      </div>
    </div>
  )
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "marcus",
      data: listOfAuthors.slice(1,1),
      dataToShow: true,
      searchResults: "",
      showDummies: {select: false, authorView: false, bookView: false},
  }
  };

  authorSearch = event => {
    var data = listOfAuthors;
    var search = this.state.search.toLowerCase();
    search = search.split(" ")
    for (let i = 0; i<search.length;i++){ 
      //For every element in the search, find a match in the data using a combination of author name, position, country and city
      data = data.filter(
      e=> 
      (e.name+e.position+e.country+e.city).toLowerCase()
      .includes(search[i])
      )}
    this.setState({data:data})
    }
  
  searchSelect = event => {
    const newData = listOfAuthors.slice(event.value-1,event.value);
    const newShowDummies = this.state.showDummies;
    newShowDummies.select = false;
    newShowDummies.authorView = true;
    this.setState({data:newData, showDummies:newShowDummies});
    window.location.href="/author/"+newData[0].id;
  }  
    
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
            <TextField //Search field
              id="outlined-basic"
              onChange={e => {
                this.setState({search:e.target.value}); //set new search value
                this.authorSearch(); //Searches for author using new search value
                var newShowDummies = this.state.showDummies; 
                newShowDummies.select = true; //Opens the select element
                newShowDummies.authorView = false; //Closes existing 
                if(this.state.search.length>0){this.setState({showDummies:newShowDummies})};
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
            {"# search results: " + this.state.data.length}
            <button id = "searchDetailBtn">{"Detailed search"}</button>
          {this.state.showDummies.select ? //Show select window if there is a search
          (<Select options={this.state.data} onChange={this.searchSelect}/>):(<div></div>)}
      </div>
      <Routes>
          <Route path={
              this.state.showDummies.authorView ? "/author/"+this.state.data[0].id:"/"
          }
          element = {
            this.state.showDummies.authorView ? 
          (<AuthorTable data={this.state.data[0]}/>):(<div></div>)
          }
          />
          <Route 
          path={"/search"}
          element = {<SearchDetailed data={this.state.data}/>}  
          />
      {listOfAuthors.map((author) => 
        <Route path={"/author/"+author.id} element={
          <AuthorTable data={author} key = {author.id}/>} key = {author.id}>
        
      </Route>)}
      </Routes>
      </BrowserRouter>
    </div>
  );
}
}

export default App;
