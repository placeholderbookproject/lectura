import React, {useState, useEffect} from 'react';
import Tooltip from '@mui/material/Tooltip';
import { filterArray } from '../formattingFuncs.js';
import Paging from '../Paging.js';
import { fetchUserData } from '../apiEffects.js';

const SearchResults = (props) => {
    const {searchResults, searchType, searchParams, setSearchParams, userData, lang} = props.values
    const removals = ["author_id","text_id","value","type"]
    const filters = filterArray(props.values.filters,removals)
    const [results, setResults] = useState(searchResults)
    const [searchOrder, setSearchOrder] = useState("asc");
    const [page, setPage] = useState(searchParams.has("page")?searchParams.get("page"):1);
    const [pageLength, setPageLength] = useState({label:'10', value:10})
    const [interactions, setInteractions] = useState({});
    const sortFunction = (event) => {
        if (searchOrder==="asc"){setSearchOrder("desc")}
        else {setSearchOrder("asc")}
        let sortedData = results;
        const colValue = filters.find(e => e.label === event.currentTarget.textContent).value;
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
        setResults(sortedData);
    }
    const renderTableHeaders = () => {
        return (
            <tr>
                {filters.map((filter) => (
                    <Tooltip key={filter.value} title="Click to sort" placement="top" arrow followCursor>
                        <th onClick={sortFunction}>{filter.label}</th>
                    </Tooltip>))}
            </tr>);
    };
    const renderTableRow = (result) => {
        return (
            <tr key={searchType === "authors" ? result.author_id : result.text_id}>
                {Object.keys(result).map((col) => {
                    if (removals.includes(col)) {return null;} 
                    else if (col === "label") {
                        return (
                            <td key={col + result[col] + result["author_id"]} className="search-result-label">
                                <p><a href={`${result["author_id"] ? "/author/" + result["author_id"] : ""}${searchType !== "authors" ? "/text/" + result["text_id"] : ""}`}>{result[col]}</a></p>
                            </td>
                        );}
                    else if (result[col] === null) {return <td key={col + result[searchType]}></td>;}
                    else {return <td key={col + result[col] + result[searchType]}>{result[col]}</td>;}
                })}
            </tr>
        );
    };
    useEffect(()=>{setResults(searchResults)},[searchResults])
    useEffect(() => {if (userData) {fetchUserData(userData.user_id, setInteractions)};},[userData])
    return (results&&results.length>0&&<div>
    {searchType!=="all"
        ?<table id = "detailed-search-results"><tbody>
            {renderTableHeaders()}
            {results.length>0&&results.slice(pageLength.value*page-pageLength.value,pageLength.value*page).map //Limitation to first page_length values
                    (result => renderTableRow(result))}
        </tbody></table>
        :<div className="search-result-all"> 
        {results.slice(pageLength.value*page-pageLength.value,pageLength.value*page).map((result) =>
            <div className="search-result-all-elements">
                <p><a className="text-row" href={result.type==="text"?`${result.author_id&&"/author/"+result.author_id}/text/${result.value}`:`/${result.type}/${result.value}`}>{result["label"]}</a></p>
            </div>)}
        </div>}
        <Paging properties = {{page, setPage, results,numberOfPages:Math.ceil(results.length/pageLength.value), pageLength, setPageLength, urlParams:searchParams, setUrlParams:setSearchParams}}/>
    </div>)
}

export default SearchResults;