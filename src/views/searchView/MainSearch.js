import {useNavigate} from 'react-router-dom'
import React, {useState, useEffect/*, useRef*/} from 'react';
import {fetchSearchResults} from '../apiEffects.js'
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from '@material-ui/icons/Clear';
import { search } from '../commonFuncs.js';

const MainSearch = () => {
    let controller = new AbortController();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchResults,setSearchResults] = useState();
    useEffect (()=> {
        const cleanup = () => {if (controller) {controller.abort();}};
        controller = new AbortController();
        query&&query.length>5&&fetchSearchResults({ setSearchResults, query, signal:controller.signal})();
        return cleanup
    },[query]);
    const enterLink = (result) => {
        const link = result.type==="text"?`${result.author_id&&"/author/"+result.author_id}/text/${result.value}`:`/${result.type}/${result.value}`
        navigate(link);setQuery("");setSearchResults();
    }
    return (
        <div className = "search-bar">
          <input type="text" placeholder="Search for an author or text" value = {query} 
            onChange = {(e) => setQuery(e.target.value)} onKeyDown={(e) => search(controller=controller, setQuery, setSearchResults,() => navigate(`/search?query=${query}&type=authors`), e)} className="search-input"/>
        {searchResults&&searchResults.length>0&&query&&
          <div className="search-dropdown-popup">{searchResults.slice(0,10).map((result) => 
            <p className="search-result" key={result.label} onClick = {() => enterLink(result)}>{result.label}</p>)}
          </div>}
          <IconButton onClick = {() => {setQuery("");navigate(`/search?query=${query}&type=authors`)}} aria-label="Search Button" edge="end"><SearchIcon/></IconButton>
          <IconButton onClick = {() => {setQuery("");setSearchResults()}} aria-label="Clear Search Button" edge="end"><ClearIcon/></IconButton>
      </div>
    )
}

export default MainSearch;