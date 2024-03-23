import {useNavigate} from 'react-router-dom'
import React, {useState, useEffect, useRef} from 'react';
import {fetchSearchResults} from '../apiEffects.js'
import IconButton from "@mui/material/IconButton";
import Search from "@mui/icons-material/Search";
import Clear from "@mui/icons-material/Clear"

const MainSearch = (props) => {
    let controller = useRef(new AbortController());
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchResults,setSearchResults] = useState([]);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    useEffect (()=> {
        const cleanup = () => {if (controller.current){controller.current.abort();}};
        controller.current = new AbortController();
        query&&query.length>5&&fetchSearchResults({ setSearchResults, query, signal:controller.current.signal})();
        return cleanup
    },[query]);
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedResultIndex(prevIndex => Math.min(prevIndex + 1, searchResults.length - 1));
      } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedResultIndex(prevIndex => Math.max(prevIndex - 1, -1));
      } else if (e.key === "Enter" && selectedResultIndex !== -1) {enterLink(searchResults[selectedResultIndex]);
      } else if (e.key === "Enter" && selectedResultIndex === -1){enterLink(searchResults);}
  };
    const enterLink = (result) => {
        const link = !result.type?`/search?query=${query}`:result.type==="text"?`${result.author_id&&"/author/"+result.author_id}/text/${result.value}`:`/${result.type}/${result.value}`
        navigate(link);setQuery("");setSearchResults([]);
    }
    return (
        <div className = "search-bar">
          <input type="text" placeholder={props.labels.searchBase} value = {query} onChange = {(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} className="search-input"/>
        {searchResults.length>0&&query&&
          <div className="search-dropdown-popup">{searchResults.slice(0,10).map((result,index) => 
            <p className={`search-result${index === selectedResultIndex ? '-selected' : ''}`} key={result.label} onClick = {() => enterLink(result)}>{result.label}</p>)}
          </div>}
          <IconButton onClick = {() => {setQuery("");navigate(`/search?query=${query}`)}} aria-label="Search Button" edge="end"><Search/></IconButton>
          <IconButton onClick = {() => {setQuery("");setSearchResults([])}} aria-label="Clear Search Button" edge="end"><Clear style={{paddingRight:5}}/></IconButton>
        </div>
    )
}

export default MainSearch;