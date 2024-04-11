import React from "react";
import { getTexts, fetchWikiData } from "../apiEffects";
import { transformXLSX } from "../commonFuncs";
import { combineLists } from "../formattingFuncs";
const TextsExtraction = ({lang, authors}) => {
    const printTexts = () => {
        getTexts({authors})
        .then(result => {
                return Promise.all(
                    [fetchWikiData(result.map(item=>item.text_q.replace('http://www.wikidata.org/entity/','')),'text_q',lang)
                    ,result.map(item => {return { ...item, text_q: item.text_q.replace('http://www.wikidata.org/entity/', '') }})])
                })
        .then(final => transformXLSX(combineLists(final[0], final[1],'text_q')))
    }
    return (<><button className="extract-texts-btn" onClick={()=>printTexts()}>Export Texts ⤓</button></>)
}
export default TextsExtraction;