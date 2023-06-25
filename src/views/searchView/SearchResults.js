import React, {useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import {Link} from 'react-router-dom';
import { filterArray } from '../formattingFuncs.js';
import ComponentPopup from '../Popup.js';

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
        searchType!=="all"
        ?<table id = "detailed-search-results"><tbody>
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
                        </tr>))}
        </tbody></table>
        :<div className="search-result-all"> 
        {searchResults.map((result) => 
            <div className="search-result-all-elements">
                <p><a className="text-row" href={result.type==="text"?`${result.author_id&&"/author/"+result.author_id}/text/${result.value}`:`/${result.type}/${result.value}`}>{result["label"]}</a></p>
                <ComponentPopup key={result["label"]} id={result.value} lang={props.lang} type={result.type}><p style={{fontWeight:600}}> &#x2193;</p></ComponentPopup>        
            </div>)}
        </div>
    )
}

export default SearchResults;