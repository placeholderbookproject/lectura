import React from "react";
const url = (element, type) => {return type==="texts" ?`${element.author_id&&"/author/"+element.author_id}/text/${element.text_id}`
                                :`/author/${element.author_id}` }

const BrowserResults = ({results, type}) => {
    return (
    <div className="search-result-all">
        {results.map((result) => result.label&& <p>
        <a className="text-row" href={url(result, type)}>{result["label"]}</a>
        </p>)} 
    </div>)
}
export default BrowserResults;