import React, {useState} from 'react';
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from '@material-ui/icons/Clear';
//import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Select from 'react-select';
import {Link} from 'react-router-dom';
//import '../App.css';

const workFilters = [
    {value: '#', label: "#"},
    {value: 'title', label: 'Title'},
    {value: 'author', label: 'Author'},
    {value: 'publication',label: 'Publication Year'},
]

const authorFilters = [
    {value: '#', label: "#"},
    {value: 'name', label: 'Author'},
    {value: 'position', label: 'Positions'},
    {value: 'birth',label: 'Birth Year'},
    {value: 'death',label: 'Death Year'},
    {value: 'floruit', label: 'floruit'},
    {value: 'country',label: 'Country of Birth'},
    {value: 'city', label:'City of Birth'},
    //{value: 'works', label: 'Works'},
]

const options = 
    {"Author":authorFilters,
    "Work":workFilters,}

function CreateList(props) {
    const values = props.data
    const filters = props.filters;
    function differentiateFilter(filter) {
        const joinedValues = values[filter["value"]]
        //if(joinedValues.constructor.name === "Array") {joinedValues = joinedValues.join(", ")} //For listing works later...
        if (filter.value === "title" | filter.value === "name") {
            if (filter.value === "title") {return(<td key={filter["label"]+joinedValues}><Link to = {"/work/"+values.id}>{joinedValues}</Link></td>)}
            else {return (<td key= {filter["label"]+joinedValues}><Link to = {"/author/"+values.id}>{joinedValues}</Link></td>)}
        }
        else {return(<td key= {filter["label"]+joinedValues}>{joinedValues}</td>)}
    }
    return (filters.map((filter) => (differentiateFilter(filter))))
}

function SearchDetailed(props) {//Add the table view of
    const data = props.data; //data["authors"]
    const [searchType, setSearchType] = useState("Author");
    const [filters, setFilters] = useState(options["Author"]);
    const [search, setSearch] = useState("");
    const [startSearch, setStartSearch] = useState(false);
    let [searchData,setSearchData] = useState(data["listOfAuthors"]); 
    let [searchResults,setSearchResults] = useState([]);
    const [searchOrder, setSearchOrder] = useState("asc");
    function changeVersion () {
        if(searchType === "Author"){
            setSearchType("Work");
            setSearchData(data["listOfWorks"]);
            setFilters(options["Work"])

        }
        else {
            setSearchType("Author");
            setSearchData(data["listOfAuthors"]);
            setFilters(options["Author"])
        }
    }
    function searchFunction() {
        setSearchResults([]);
        if (filters.length>0){
            setStartSearch(true);
            var dataSearch = searchData.slice(0,searchData.len);
            var results = [];
            var resultNumber = 0;
            for (let n = 0; n<dataSearch.length;n++ in dataSearch){
                const dataElement = dataSearch[n];
                var found = false;
                for (let i = 0; i<filters.length;i++) {
                    if(found){continue};
                    const filter = filters[i];
                    const toSearch = String(dataElement[filter["value"]]).toLowerCase();
                    if (toSearch.includes(search.toLowerCase())) {
                        resultNumber += 1;
                        dataElement["#"] = resultNumber;
                        results.push(dataElement);
                        found = true;
                    }
                }
            }
            setSearchResults(results);
        }
    }
    function onEnter(e) {if(e.keyCode === 13){searchFunction()}}
    function clearSearch() {setStartSearch(false); setSearch("")}
    function sortFunction(event) {
        if (searchOrder==="asc"){setSearchOrder("desc")}
        else {setSearchOrder("asc")}
        var sortedData = searchResults;
        const col = event.currentTarget.textContent;
        var filtersWithIndex = filters
        var findColumn = filtersWithIndex.find((e) => e.label.includes(col)).value
        function compare(a,b){
            b = b[findColumn]
            a = a[findColumn]
            if(a === "unknown"| b === "unknown") {return -1;}
            if ( a < b ){
                if(searchOrder ==="desc") {return -1;}
                else{return 1;}}
              if ( a > b){
                if(searchOrder==="desc") {return 1;}
                else {return -1;}}
              return 0;
            }
        sortedData = sortedData.sort(compare)
        setSearchResults(sortedData);
    }
    return (
      <div className = "detailedSearch">
        <div id = "detailedSearchHeader">
            <button className="changeSearchVersionBtn" onClick={changeVersion}>{+ (searchType === "Author")? "Works":"Authors"}</button>
            <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
                <InputLabel 
                    htmlFor="outlined-adornment-password"
                    >
                    Search
                </InputLabel>
                <OutlinedInput
                id="outlined-adornment-password"
                type={"text"}
                inputProps={{style: 
                {fontSize: 20,
                height: 10}
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick = {searchFunction}
                            aria-label="Search Button"
                            edge="end"
                        >
                            <SearchIcon />
                        </IconButton>
                        <IconButton onClick = {clearSearch}
                            aria-label="Clear Search Button"
                            edge="end"
                        >
                            <ClearIcon />
                        </IconButton>

                    </InputAdornment>
                }
                label="Search"
                value = {search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown = {onEnter}
                />
            </FormControl>
            <Select 
            options = {(searchType === "Author") ? options["Author"]:options["Work"]}
            onChange = {(e) => setFilters(e)}
            value = {filters}
            placeholder = {"Select search filters"}
            isMulti
            />
        </div>
        <>{/*Table of search results*/}
          <table id = "detailedSearchResults">
          <tbody>
            <tr>
              {filters.length>0 ? filters.map((filter) =>
                (<th onClick={sortFunction} key={filter.value}>{filter.label}</th>)
              ):<></>}
            </tr>
            {startSearch ? (
                searchResults.map (result => (
                    <tr key = {result.id}>
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