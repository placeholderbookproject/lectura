import React from "react";
const url = (element, type) => {
    const author_id=type==="texts"?element.author_id&&element.author_id.split(", ")[0]:element.author_id
    return type==="texts" ?author_id&&`${"/author/"+author_id+"/text/"+element.text_id}`:`/author/${author_id}` }

const BrowserResults = ({results, type}) => {
    return (
    <div className="search-result-all">
        {results.map((result) => result.label&& <p>
        <a className="text-row" href={url(result, type)}>{result["label"]}{`${type==="authors"&&result.book_cnt>0?" ("+result.book_cnt + " texts)":""}`}</a>
        </p>)} 
    </div>)
}
export default BrowserResults;