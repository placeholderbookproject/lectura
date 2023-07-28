import React, {useState, useEffect} from 'react';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import FormHelperText from '@mui/material/FormHelperText';
import Select from 'react-select';
import {useSearchParams} from 'react-router-dom';
import {options} from '../filters.js';
import { fetchSearchResults } from '../apiEffects.js';
import SearchResults from './SearchResults.js';

const SearchDetailed = (props) => {
    const [searchParams,setSearchParams] = useSearchParams();
    const searchOptions = ["all","authors","texts"]
    const [searchType, setSearchType] = useState("all");
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults,setSearchResults] = useState([]);
    const searchFunction = (searchVar = search, type=searchType) => {
        const searchFilters = options[type].slice(0,6);
        setSearchParams({'query':searchVar,'type':type})
        fetchSearchResults({ setSearchResults, query:searchVar, type:type==="all"?null:type, filters:type!=="all"?searchFilters:""})();
    }
    const onEnter = (e) => {if(e.key==="Enter"){searchFunction()}}
    const clearSearch = () => {setSearch("");setSearchResults([]);}
    useEffect (() => {//Search if a search query parameter exists in the url
        const searchQuery = [...searchParams];
        if(searchQuery.length>0 && searchQuery[0][0]==="query" && searchQuery[0][1] !== "") {
            searchFunction(searchQuery[0][1]);
            setSearch(searchQuery[0][1]);
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    const clickRadio = (option) => {
        setSearchParams({'query':search,'type':option})
        setFilters(options[option].slice(0,6));
        setSearchType(option);
        searchFunction(search,option)
    }
    return (
      <div className = "detailed-search">
        <div className = "detailed-search-header">
            <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
                <InputLabel>Search</InputLabel>
                <OutlinedInput type="text" inputProps={{style: {fontSize: 20, height: 10}}}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick = {() => searchFunction()} aria-label="Search Button" edge="end"><SearchIcon/></IconButton>
                            <IconButton onClick = {clearSearch} aria-label="Clear Search Button" edge="end"><ClearIcon/></IconButton>
                        </InputAdornment>}
                    label="Search" value = {search}
                    onChange={(e) => setSearch(e.target.value)} onKeyDown = {onEnter}/>
                <FormHelperText>{(searchResults.length>0)?"Your query returned #" + searchResults.length +" results":""}</FormHelperText>
            </FormControl>
            <fieldset className="search-type">{searchOptions.map((option) => 
                <><input type = "radio" id={option} name="search-type" key={option} onClick={()=>clickRadio(option)} checked={option===searchType}
                    onChange={() => clickRadio(option)}/>
                    <label>{option.charAt(0).toUpperCase()+option.slice(1)}</label>
                </>)}
            </fieldset>
            {searchType!=="all"&&<Select options = {(searchType === "authors") ? options["authors"]:options["texts"]}
                onChange = {(e) => setFilters(e)}
                value = {filters} placeholder = {"Select search filters"}
                isMulti
            />}
        </div>
        <SearchResults filters={filters} searchResults={searchResults} setSearchResults={setSearchResults} searchType={searchType} lang={props.lang}
            searchParams={searchParams} setSearchParams={setSearchParams}
        />
      </div>
    )
  }

export default SearchDetailed;