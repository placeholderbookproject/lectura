import React, {useState, useEffect} from "react";
import Paging from '../Paging.js';
import { fetchBrowse } from "../apiEffects";
import {useSearchParams} from 'react-router-dom';
import BrowseOptions from "./BrowseOptions.js";
import BrowserResults from "./BrowseResults.js";
import BrowserSort,{sortOptions} from "./BrowserSort.js";
const BrowseView = ({labels, lang}) => {
    const [searchParams,setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.has("page")?searchParams.get("page"):1);
    const [pageLength, setPageLength] = useState({label:'10', value:10})
    const [results, setResults] = useState([]);
    const [sort, setSort] = useState({value:"text_id", label:"Text Id"});
    const [type, setType] = useState("texts");
    //Sorting, filtering, paging, getData (dépendent des sorting, filtering & paging)
    //Filtering: langue, pays, année de naissance, année de mort
    useEffect(() => {fetchBrowse({type, sort, page, pageLength:pageLength.value}).then(result => setResults(result))},[sort, page, pageLength, type])
    return (<div>
    <BrowserSort setSort={setSort} sort={sort} labels={labels} lang={lang} type={type}/>
    <BrowseOptions setType={setType} labels={labels} lang={lang}/>
    <BrowserResults results={results} type={type}/>
    <Paging properties = {{page, setPage, results,numberOfPages:100, pageLength, setPageLength, urlParams:searchParams, setUrlParams:setSearchParams}}/>
    </div>)
}
export default BrowseView;