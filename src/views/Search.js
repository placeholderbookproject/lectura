import React, {useState, useEffect} from 'react';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Tooltip from '@mui/material/Tooltip';
import FormHelperText from '@mui/material/FormHelperText';
import Select from 'react-select';
import {Link, useSearchParams} from 'react-router-dom';

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
    {value: 'floruit', label: 'Floruit'},
    {value: 'country',label: 'Country of Birth'},
    {value: 'city', label:'City of Birth'},
    //{value: 'works', label: 'Works'},
]

const options = 
    {"author":authorFilters,
    "work":workFilters,}

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
    let [searchParams,setSearchParams] = useSearchParams();
    const data = props.data; //data["authors"]
    const [searchType, setSearchType] = useState("author"); //searchParams.get('type') fix type query later..
    const [filters, setFilters] = useState(options["author"]);
    const [search, setSearch] = useState("");
    const [startSearch, setStartSearch] = useState(false);
    let [searchData,setSearchData] = useState(data["listOfAuthors"]); 
    let [searchResults,setSearchResults] = useState([]);
    const [searchOrder, setSearchOrder] = useState("asc");
    function changeVersion () {
        setSearchResults([]);
        if(searchType === "author"){
            setSearchType("work");
            setSearchData(data["listOfWorks"]);
            setFilters(options["work"])
        }
        else {
            setSearchType("author");
            setSearchData(data["listOfAuthors"]);
            setFilters(options["author"])
        }
    }
    function searchFunction(searchVar = search) {
        //setSearchParams()
        var searchInput = searchVar;
        setSearchResults([]);
        if (filters.length>0 && searchInput.length>0){
            setSearchParams({'query':searchInput,
                             'type':searchType   
                            })
            setStartSearch(true);
            var dataSearch = searchData.slice(0,searchData.len);
            var searchElements = searchInput.toLowerCase().split(" ");
            for (let j = 0; j<searchElements.length;j++) {
                var results = [];
                var resultNumber = 0;
                var element = searchElements[j];
                for (let n = 0; n<dataSearch.length;n++ in dataSearch){
                    const dataElement = dataSearch[n];
                    var found = false;
                    for (let i = 0; i<filters.length;i++) {
                        if(found){continue};
                        const filter = filters[i];
                        const toSearch = String(dataElement[filter["value"]]).toLowerCase();
                        if (toSearch.includes(element)) {
                            resultNumber += 1;
                            dataElement["#"] = resultNumber;
                            results.push(dataElement);
                            found = true;
                        }
                    }
                }
                dataSearch = results
            }
            setSearchResults(results);
        }
    }
    function onEnter(e) {if(e.keyCode === 13){searchFunction()}}
    function clearSearch() {
        setSearch("");
        setSearchResults([]);
    }
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
            if(a === ""|b === "") {
                if(searchOrder==="desc"){return 1;}
                else {return -1;}}
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
    useEffect ( () => {//Search if a search query parameter exists in the url
        const searchQuery = [...searchParams];
        if(searchQuery.length>0 && searchQuery[0][0]==="query" && searchQuery[0][1] !== ""){
            setStartSearch(true);
            searchFunction(searchQuery[0][1]);
            setSearch(searchQuery[0][1]);
        }
    },[startSearch] // eslint-disable-line react-hooks/exhaustive-deps
    )
    return (//Need to add dynamic search link. I.e. when enter -> change search. Also add basic filters from link
      <div className = "detailedSearch">
        <div id = "detailedSearchHeader">
            <button className="changeSearchVersionBtn" onClick={changeVersion}>{+ (searchType === "author")? "Works":"Authors"}</button>
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
                onChange={(e) => 
                    setSearch(e.target.value)
                    }
                onKeyDown = {onEnter}
                />
                <FormHelperText>
                    {"Your search returned " + searchResults.length +" results"}
                </FormHelperText>
            </FormControl>
            <Select 
            options = {(searchType === "author") ? options["author"]:options["work"]}
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
              {filters.length>0 && startSearch ? filters.map((filter) =>
                ( 
                    <Tooltip sx = {{fontSize:15}}key={filter.value} title="Click to sort" placement="top" arrow followCursor>
                    <th onClick={sortFunction}>{filter.label}</th>
                    </Tooltip>
                )
              ):<></>}
            </tr>
            {search.length>0 ? (
                (searchResults.length>100?searchResults.slice(0,100):searchResults).map //Limitation to first 100 values
                (result => (
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