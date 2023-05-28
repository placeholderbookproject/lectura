import {useNavigate} from 'react-router-dom'
import React, {useState, useEffect} from 'react';
import {fetchSearchResults} from './apiEffects.js'

const MainSearch = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchResults,setSearchResults] = useState();
    useEffect (()=> {query&&query.length>5&&fetchSearchResults({ setSearchResults, query})();},[query]);
    const searchSelect = (e) => {setQuery(e.target.value);}
    const search = (event) => {
      if (event.key==="Enter"){
        setQuery(event.target.value);
        fetchSearchResults({ setSearchResults, query})();
      }
      else if (event.key==="Escape") {setQuery("");setSearchResults();}
    }
    const enterLink = (result) => {
        navigate(result.type==="text"?`${result.author_id&&"/author/"+result.author_id}/text/${result.value}`:`/${result.type}/${result.value}`);
        setQuery("");
    }
    return (
        <div className = "search-bar">
          <input type="text" placeholder="Search for an author or text" value = {query} 
            onChange = {searchSelect} onKeyDown={search} className="search-input"/>
        {searchResults&&searchResults.length>0&&query&&
          <div className="search-dropdown-popup">{searchResults.map((result) => 
            <p className="search-result" key={result.label} onClick = {() => enterLink(result)}>{result.label}</p>)}
          </div>}
          <button className="clear-search-button" onClick = {() => {setQuery("");setSearchResults()}}>X</button>    
      </div>
    )
}

export default MainSearch;