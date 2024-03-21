import React, {useEffect, useState} from "react";
import { fetchSearchResults } from "../apiEffects";
import {options} from '../filters.js';
const AddSearch = ({query, type}) => {
    const [searchResults, setSearchResults] = useState([])
    let controller = new AbortController();
    useEffect (()=> {
        const cleanup = () => {if (controller) {controller.abort();}};
        controller = new AbortController();
        const filters = options[type==="Author"?"authors":"texts"].slice(0,3)
        setSearchResults([]);
        query&&query.length>3&&fetchSearchResults({setSearchResults,query,filters,type:type.toLowerCase()+'s',signal:controller.signal})();
        return cleanup
    },[query, type]);
    return (
    <div className="search-result-list">
        {searchResults.length>0&&<h2>Similar</h2>}
        {searchResults.slice(0,10).map((item)=> <span className="list-search-result" key={item.value}><p>
            <a href={type==="Author"?`/author/${item.author_id}`:`/author/${item.author_id}/text/${item.text_id}`}>{item.label}</a></p></span>)}
    </div>
    )
}
export default AddSearch;