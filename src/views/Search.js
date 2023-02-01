import React, {useState} from 'react';
import TextField from "@mui/material/TextField";
import Select from 'react-select';

const workFilters = [
    {value: 'title', label: 'Title'},
    {value: 'author', label: 'Author'},
    {value: 'publication',label: 'Publication Year'},
]

const authorFilters = [
    {value: 'name', label: 'Author'},
    {value: 'position', label: 'Positions'},
    {value: 'birth',label: 'Birth Year'},
    {value: 'death',label: 'Death Year'},
    {value: 'country',label: 'Country of Birth'},
    {value: 'city', label:'City of Birth'},
]

const options = 
    {"Author":authorFilters,
    "Work":workFilters,}

function CreateList(props) {
    const values = props.data;
    const filters = props.filters;
    return (filters.map((filter) => (<td>{values[filter["value"]]}</td>)))
}


function SearchDetailed(props) {//Add the table view of
    const data = props.data; //data["authors"]
    const [searchType, setSearchType] = useState("Author");
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    const [startSearch, setStartSearch] = useState(false);
    let [searchData,setSearchData] = useState(data["listOfAuthors"]); 
    let [searchResults,setSearchResults] = useState([])
    //var search = props.search;
    //var data = props.data;
    //List of options with label and options from these options
    //search field + clickable dropdown of variables to search through
    function changeVersion () {
        if(searchType === "Author"){
            setSearchType("Work");
            setSearchData(data["listOfWorks"]);
        }
        else {
            setSearchType("Author");
            setSearchData(data["listOfAuthors"]);
        }
        setFilters([]);
    }
    function searchFunction() {
        if (filters.length>0){
            setStartSearch(true);
            var dataSearch = searchData.slice(0,searchData.len);
            var results = [];
            for (let n = 0; n<dataSearch.length;n++ in dataSearch){
                const dataElement = dataSearch[n];
                for (let i = 0; i<filters.length;i++) {
                    const filter = filters[i]
                    const toSearch = String(dataElement[filter["value"]]).toLowerCase()
                    if (toSearch.includes(search.toLowerCase())) {
                        results.push(dataElement)
                        continue
                    }
                }
            }
            setSearchResults(results);
        }
    }
    return (
      <div className = "detailedSearch">
        <>
            <TextField onChange = {(e) => setSearch(e.target.value)}/>{/*onChange = {(e) => setSearch(e.target.value)} */}
            <button onClick={changeVersion}>Click to search for '{+ (searchType === "Author")? "works'":"authors'"}</button>
            <button onClick = {searchFunction}>Click to search</button>
            <Select 
            options = {(searchType === "Author") ? options["Author"]:options["Work"]}
            onChange = {(e) => setFilters(e)}
            value = {filters}
            placeholder = {"Select search filters"}
            isMulti
            />
        </>
        <>
          <table>
          <tbody>
            <tr>
              {filters.length>0 ? filters.map((filter) =>
                (<td key={filter.value}>{filter.label}</td>)
              ):<></>}
            </tr>
            {startSearch ? (
                searchResults.map (result => (
                    <tr>
                    <CreateList data = {result} filters = {filters}/>
                    </tr>
                    ))
            ):(<></>)}
          </tbody>
          </table>
        </>
      </div>
    )
  }

export default SearchDetailed;