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
import {options} from './filters.js';

const CreateList = (props) => {
    const values = props.data
    const filters = props.filters;
    const differentiateFilter = (filter) => {
        const joinedValues = values[filter["value"]]
        if (filter.value === "text_title" | filter.value === "author_name") {
            if (filter.value === "text_title") {return(<td key={filter["label"]+joinedValues}><Link to = {"/text/"+values.text_id}>{joinedValues}</Link></td>)}
            else {return (<td key= {filter["label"]+joinedValues}><Link to = {"/author/"+values.author_id}>{joinedValues}</Link></td>)}
        }
        else {return(<td key= {filter["label"]+joinedValues}>{joinedValues}</td>)}
    }
    return (filters.map((filter) => (differentiateFilter(filter))))
}

const SearchDetailed = (props) => {
    let [searchParams,setSearchParams] = useSearchParams();
    const data = props.data;
    const [searchType, setSearchType] = useState("authors");
    const [filters, setFilters] = useState(options["authors"].slice(0,3));
    const [search, setSearch] = useState("");
    const [startSearch, setStartSearch] = useState(false);
    let [searchData,setSearchData] = useState(data["authors"]); 
    let [searchResults,setSearchResults] = useState([]);
    const [searchOrder, setSearchOrder] = useState("asc");
    const changeVersion = (searchType) =>  {
        setSearchResults([]);
        const newType = searchType==="authors"?"texts":"authors"
        setSearchType(newType);
        setSearchData(data[newType]);
        setFilters(options[newType].slice(0,3));
        setSearch("")
    }
    const searchFunction = (searchVar = search) => {
        const searchInput = searchVar;
        let results
        if (filters.length>0 && searchInput.length>0){
            setSearchParams({'query':searchInput,'type':searchType})
            setStartSearch(true);
            let dataSearch = searchData.slice(0,searchData.len);
            const searchElements = searchInput.toLowerCase().split(" ");
            for (let j = 0; j<searchElements.length;j++) {
                results = []
                let resultNumber = 0, element = searchElements[j];
                for (let n = 0; n<dataSearch.length;n++ in dataSearch){
                    const dataElement = dataSearch[n];
                    let found = false;
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
    const onEnter = (e) => {if(e.keyCode === 13){searchFunction()}}
    const clearSearch = () => {
        setSearch("");
        setSearchResults([]);
    }
    const sortFunction = (event) => {
        if (searchOrder==="asc"){setSearchOrder("desc")}
        else {setSearchOrder("asc")}
        let sortedData = searchResults;
        const col = event.currentTarget.textContent;
        const filtersWithIndex = filters
        const colValue = filtersWithIndex.find((e) => e.label.includes(col)).value
        const compare = (a,b) => {
            b = b[colValue]
            a = a[colValue]
            if(a === null|b === null) {return 0;}
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
    return (
      <div className = "detailedSearch">
        <div id = "detailedSearchHeader">
            <button className="changeSearchVersionBtn" onClick={() => changeVersion (searchType)}>
                {(searchType === "authors")? "Texts":"Authors"}</button>
            <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
                <InputLabel>Search</InputLabel>
                <OutlinedInput
                    type="text"
                    inputProps={{style: {fontSize: 20, height: 10}}}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick = {() => searchFunction()}
                                aria-label="Search Button"
                                edge="end"                        >
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
                <FormHelperText>
                    {(searchResults.length>0)?"Your query returned #" + searchResults.length +" results":""}
                </FormHelperText>
            </FormControl>
            <Select 
            options = {(searchType === "authors") ? options["authors"]:options["texts"]}
            onChange = {(e) => setFilters(e)}
            value = {filters}
            placeholder = {"Select search filters"}
            isMulti
            />
        </div>
        <>{/*Table of search results*/}
          <table id = "detailedSearchResults"><tbody>
                <tr>
                    {filters.length>0 && startSearch ? filters.map((filter) => (
                    <Tooltip sx = {{fontSize:15}}key={filter.value} title="Click to sort" placement="top" arrow followCursor>
                        <th onClick={sortFunction}>{filter.label}</th>
                    </Tooltip>
                    )):<></>}
                </tr>
                {search.length>0 
                ?(((searchResults.length>100)?searchResults.slice(0,100):searchResults).map //Limitation to first 100 values
                    (result => (
                        <tr key = {result.id}>
                            <CreateList data = {result} filters = {filters}/>
                        </tr>
                        )))
                :(<></>)}
          </tbody></table>
        </>
      </div>
    )
  }

export default SearchDetailed;