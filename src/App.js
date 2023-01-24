import './App.css';
import React from 'react';
import TextField from "@mui/material/TextField";
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css';

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

//Options for dropdown
const options = [
  {name: 'Swedish', value: 'sv'},
  {name: 'English', value: 'en'},
];


/*Building a frame for an author:
  Author name tr -> later a popdown
  Birth & Location tr 
  Death tr
  (floruit if birth/death does not exist)
  Position tr
  BOOK COMPONENT
*/



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "marcus",
      data: listOfAuthors.slice(1,1),
      dataToShow: true,
      searchResults: "",
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
    
  render() {
  return (
    <div>
        <div className = "search">
          <TextField
            id="outlined-basic"
            onChange={e => {
              this.setState({search:e.target.value});
              this.authorSearch();
              }}
            variant="outlined"
            //fullwidth
            label="Search"
          />
          {"# search results: " + this.state.data.length}
          <table>
          <tbody>
          {this.state.data.map((author) => //<AuthorSearch value = {author} key={author.id}/>
          //onClick = {console.log("Clicked!!")} just getting the value = click. Click is just an event.
          <tr><td><a href = {"https://www.google.com/search?q="+author.name}>
          <button key={author.id}>{"#"+author.id+": "+author.name.split(",")[0] + " - " + author.position +
            " ("+Math.abs(author.birth)+"-"+author.deathString/*+", fl. " + props.value.floruit*/+")" }</button>
          </a></td></tr>
          )}
          </tbody>
          </table>
        </div>
    </div>
  );
}
}

export default App;
