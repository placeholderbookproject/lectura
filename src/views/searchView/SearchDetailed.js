import React, {useState, useEffect} from 'react';
import Search from "@mui/icons-material/Search";
import Clear from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Select from 'react-select';
import {useSearchParams} from 'react-router-dom';
import {options} from '../filters.js';
import { fetchSearchResults } from '../apiEffects.js';
import SearchResults from './SearchResults.js';

const SearchDetailed = ({userData, lang}) => {
    const [searchParams,setSearchParams] = useSearchParams();
    const [searchType, setSearchType] = useState(searchParams.get("type") || "all");
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState(searchParams.get("query") || "");
    const [searchResults,setSearchResults] = useState([]);
    const searchFunction = (searchVar, type=searchType) => {
        const searchFilters = options[type].slice(0,6);
        const existingParams = new URLSearchParams();
        existingParams.set('query', searchVar);existingParams.set('type',type);
        setSearchParams(existingParams)
        setFilters(searchFilters);
        fetchSearchResults({setSearchResults, query:searchVar, type:type==="all"?null:type, filters:type!=="all"?searchFilters:""})()
        .then(results => setSearchResults(results.filter(obj => obj.label !== null)));
    }
    const onEnter = (e) => {if(e.key==="Enter"){searchFunction(search)}}
    const clearSearch = () => {setSearch("");setSearchResults([]);}
    useEffect (() => {//Search if a search query parameter exists in the url
        const searchQuery = [...searchParams];
        if(searchQuery.length>0 && searchQuery[0][0]==="query" && searchQuery[0][1] !== "") {
            setSearch(searchQuery[0][1]);
            setSearchType(searchParams.get("type") || "all");
            searchFunction(searchQuery[0][1], searchParams.get("type") || "all");
        }},[]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
      <div className = "detailed-search">
        <div className = "detailed-search-header">
            <div className="detailed-search-bar">
                <input type="text" placeholder={"Search"} value = {search} onChange = {(e) => setSearch(e.target.value)} onKeyDown={onEnter} className="search-input"/>
                <IconButton onClick = {() => searchFunction()} aria-label="Search Button" edge="end"><Search/></IconButton>
                <IconButton onClick = {clearSearch} aria-label="Clear Search Button" edge="end"><Clear style={{paddingRight:5}}/></IconButton>
            </div>
            <fieldset className="search-type">
                    {["all", "authors", "texts"].map((option) =>
                        <><input type="radio" id={option} name="search-type" checked={option === searchType} key={option}
                                onChange={() => {
                                    setSearchResults([]);
                                    setSearchParams({ 'query': search, 'type': option });
                                    setFilters(options[option].slice(0, 6));
                                    setSearchType(option);
                                    searchFunction(search,option);
                                }}/>
                            <label>{option.charAt(0).toUpperCase() + option.slice(1)}</label></>)}
            </fieldset>
            <p className="search-result-length">{(searchResults.length > 0) ? `Your query returned ${searchResults.length} results` : ""}</p>
            {searchType!=="all"&& <Select options = {(searchType === "authors")?options["authors"]:options["texts"]} 
                onChange = {(e) => setFilters(e)} value = {filters} placeholder = {"Select search filters"} isMulti/>}
        </div>
        {searchResults.length>0&&<SearchResults values = {{filters, searchResults, searchType, lang, searchParams, setSearchParams, userData}}/>}
      </div>
    )
  }

export default SearchDetailed;