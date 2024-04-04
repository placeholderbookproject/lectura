import React, {useState, useEffect} from "react";
import Paging from '../Paging.js';
import { fetchBrowse } from "../apiEffects";
import {useSearchParams} from 'react-router-dom';
import BrowserResults from "./BrowseResults.js";
import BrowserSort from "./BrowserSort.js";
import BrowserFilters from "./BrowserFilters.js";
const BrowseView = ({labels, lang}) => {
    const [searchParams,setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.has("page")?searchParams.get("page"):1);
    const [pageLength, setPageLength] = useState({label:'10', value:10})
    const [results, setResults] = useState([]);
    const [resultLength, setResultLength] = useState(0)
    const [type, setType] = useState("texts");
    const [sort, setSort] = useState(type==="authors"?{value:"author_id", label:"Author Id",order:'asc'}:{value:"text_id", label:"Text Id", order:'asc'});
    const [selectedFilters, setSelectedFilters] = useState({});
    const options = [{label:"Authors", value:"authors"},{label:"Texts", value:"texts"}]
    const changeType = (opt) => {setSort(opt.value==="authors"?{value:"author_id", label:"Author Id", order:sort.order}:{value:"text_id", label:"Text Id", order:sort.order});
                                setType(opt.value);setResults([]);setSelectedFilters({})}
    //Sorting, filtering, paging, getData (dépendent des sorting, filtering & paging)
    //Filtering: langue, pays, année de naissance, année de mort
    useEffect(() => {fetchBrowse({type, sort, page, pageLength:pageLength.value, selectedFilters}).then(result => {setResults(result.result);setResultLength(result.result_length)})}
        ,[sort, page, pageLength, type, selectedFilters])
    return (<div className="browser-view-container">
    <div className="browse-options">
        {options.map((opt) => <button className={`browser-type${type===opt.value?'-active':''}`} onClick={()=>changeType(opt)}>{opt.label}</button>)}
    </div>
    <div className="browser-header">
        <BrowserSort setSort={setSort} sort={sort} labels={labels} lang={lang} type={type}/>
        <BrowserFilters type={type} labels={labels} lang={lang} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>
    </div>
    <p>{`${resultLength} ${type} exist`}</p>
    <BrowserResults results={results} type={type}/>
    <Paging properties = {{page, setPage, results,numberOfPages:Math.min(20,resultLength/pageLength.value), pageLength, setPageLength, urlParams:searchParams, setUrlParams:setSearchParams}}/>
    </div>)
}
export default BrowseView;