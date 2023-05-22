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
import { fetchSearchResults } from './apiEffects.js';

const CreateList = (props) => {
    const values = props.data
    const idType = props.type=="authors"?"author_id":"text_id"
    return (
        Object.keys(values).map((value) => {
            if (value === "Author") {
                return <td key={value+values[value]+values["author_id"]}><Link to={"/author/"+values["author_id"]}>{values["Author"]}</Link></td>;
            } else if (value === "Title") {
                return <td key={value+values[value]+values["text_id"]}><Link to={"/text/"+values["text_id"]}>{values["Title"]}</Link></td>;
            } 
            else if (value==="author_id" || value==="text_id") {return null;}
            else if (values[value]===null){return <td key={value+values[idType]}></td>;}
            else {return <td key={value+values[value]+values[idType]}>{values[value]}</td>;}
        }));    
 }

const SearchDetailed = (props) => {
    let [searchParams,setSearchParams] = useSearchParams();
    const [searchType, setSearchType] = useState("authors");
    const [filters, setFilters] = useState(options["authors"].slice(0,6));
    const [search, setSearch] = useState("");
    let [searchResults,setSearchResults] = useState([]);
    const [searchOrder, setSearchOrder] = useState("asc");
    const changeVersion = (searchType) =>  {
        setSearchResults([]);
        const newType = searchType==="authors"?"texts":"authors"
        setSearchType(newType);
        setFilters(options[newType].slice(0,6));
        setSearch("")
    }
    const searchFunction = (searchVar = search) => {
        const searchInput = searchVar;
        setSearchParams({'query':searchInput,'type':searchType/*, filter:JSON.stringify(filters)*/})
        fetchSearchResults({ setSearchResults, query:searchInput, type:searchType, filters})();
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
        const colValue = event.currentTarget.textContent;
        const compare = (a,b) => {
            b = b[colValue]
            a = a[colValue]
            if(a === null|b === null) {return 0;}
            if (a < b ){
                if(searchOrder ==="desc") {return -1;}
                else{return 1;}}
              if (a > b){
                if(searchOrder==="desc") {return 1;}
                else {return -1;}}
              return 0;
            }
        sortedData = sortedData.sort(compare)
        setSearchResults(sortedData);
    }
    useEffect (() => {//Search if a search query parameter exists in the url
        const searchQuery = [...searchParams];
        if(searchQuery.length>0 && searchQuery[0][0]==="query" && searchQuery[0][1] !== ""){
            searchFunction(searchQuery[0][1]);
            setSearch(searchQuery[0][1]);
        }
    },[searchParams] // eslint-disable-line react-hooks/exhaustive-deps
    )
    useEffect(() => {
        setSearchParams({'query':search,'type':searchType})
        fetchSearchResults({ setSearchResults, query:search, type:searchType, filters})();
    },[filters])
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
                            <IconButton onClick = {() => searchFunction()} aria-label="Search Button" edge="end"                        >
                                <SearchIcon />
                            </IconButton>
                            <IconButton onClick = {clearSearch} aria-label="Clear Search Button" edge="end">
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
          <table id = "detailedSearchResults"><tbody>
                <tr>
                    {filters.length>0
                    ? filters.map((filter) => (
                    <Tooltip sx = {{fontSize:15}}key={filter.value} title="Click to sort" placement="top" arrow followCursor>
                        <th onClick={sortFunction}>{filter.label}</th>
                    </Tooltip>))
                    :<></>}
                </tr>
                {search.length>0 
                &&(((searchResults.length>100)?searchResults.slice(0,100):searchResults).map //Limitation to first 100 values
                    (result => (
                        <tr key = {searchType === "author"?result.author_id:result.text_id}><CreateList data = {result} type = {searchType}/></tr>)))}
          </tbody></table>
      </div>
    )
  }

export default SearchDetailed;