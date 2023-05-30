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
import { filterArray } from './formattingFuncs.js';
import ComponentPopup from './Popup.js';

const SearchResults = (props) => {
    const removals = ["author_id","text_id","value","type"]
    const filters = filterArray(props.filters,removals) 
    const searchResults = props.searchResults, searchType=props.searchType;
    const [searchOrder, setSearchOrder] = useState("asc");
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
        props.setSearchResults(sortedData);
    }
    return (
        searchType!=="all"?
        <table id = "detailed-search-results"><tbody>
            <tr>
                {filters.length>0 && filters.map((filter) => ( //Headers mapping with tooltip
                <Tooltip sx = {{fontSize:15}} key={filter.value} title="Click to sort" placement="top" arrow followCursor>
                    <th onClick={sortFunction}>{filter.label}</th>
                </Tooltip>))}
            </tr>
            {searchResults.length>0&&
                ((searchResults.length>100)?searchResults.slice(0,100):searchResults).map //Limitation to first 100 values
                    (result => (
                        <tr key = {searchType === "author"?result.author_id:result.text_id}>
                            {Object.keys(result).map((col) => {
                                if(removals.includes(col)){return null}
                                else if (col === "Author"||col==="Title") 
                                    {return <td key={col+result[col]+result["author_id"]}>
                                        <Link to={`${result["author_id"]?"/author/"+result["author_id"]:""}${col!=="Author"?"/text/"+result["text_id"]:""}`}>{result[col]}</Link></td>}
                                else if (result[col]===null){return <td key={col+result[searchType]}></td>}
                                else {return <td key={col+result[col]+result[searchType]}>{result[col]}</td>}
                            })}
                        </tr>)
                    )}
        </tbody></table>
        :<div className="search-result-all"> 
        {searchResults.map((result) => 
            <div className="search-result-all-elements">
                <p><a className="text-row" href={result.type==="text"?`${result.author_id&&"/author/"+result.author_id}/text/${result.value}`:`/${result.type}/${result.value}`}>{result["label"]}</a></p>
                <ComponentPopup key={result["label"]} id={result.value} lang={props.lang} type={result.type}><p style={{fontWeight:600}}> &#x2193;</p></ComponentPopup>        
            </div>   
            )}
        </div>
    )
}

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
        if(searchQuery.length>0 && searchQuery[0][0]==="query" && searchQuery[0][1] !== ""){
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
        <SearchResults filters={filters} searchResults={searchResults} setSearchResults={setSearchResults} searchType={searchType} lang={props.lang}/>
      </div>
    )
  }

export default SearchDetailed;