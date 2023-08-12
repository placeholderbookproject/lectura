import React, {useState, useEffect} from 'react';
import {fetchDataEffect, wikidataEffect} from '../apiEffects.js';
import {removeDuplicateList, removeWorksOutOfBounds, getUniquePropertyValues} from '../formattingFuncs.js';
import Filters from '../Filter.js';
import SubTextsTable from './SubTextsTable.js';
import AuthorTextSearch from './AuthorTextSearch.js';
import AuthorTextSort,{sortList} from './AuthorTextSort.js';

const AuthorTexts = (props) => {
    const {author, language, handleClick, text_id} = props
    const {author_birth_year, author_death_year, author_name, author_q, author_id} = author
    const [wikiTextdata, setWikiTextdata] = useState();
    const [storedtexts,setStoredtexts] = useState();
    const [expandTexts, setExpandTexts] = useState(false)
    const [originTexts, setOriginTexts] = useState()
    const [texts, setTexts] = useState();
    const [sortKey, setSortKey] = useState({ keys: ['publYear', 'dopYear', 'inceptionYear'] });
    const filterOptions = texts && [{label: 'Form', property: 'formLabel', values: getUniquePropertyValues(texts, 'formLabel') },
                                    {label: 'Language', property: 'languageLabel', values: getUniquePropertyValues(texts, 'languageLabel') },
                                    {label: 'Genre', property: 'genreLabel', values: getUniquePropertyValues(texts, 'genreLabel') },];
    useEffect (() => {if(author&&author_q) {
                        fetchDataEffect({setData:setStoredtexts, id:author_id, type:'texts', by: "author"})();
                        wikidataEffect({q_number:author_q.replace('http://www.wikidata.org/entity/',''),setWikidata:setWikiTextdata,type:"author_texts", language:language.value})();
                    }}
    ,[author, language, text_id])
    useEffect(() => {if(wikiTextdata&&storedtexts&&author) {
        const combinedData = removeWorksOutOfBounds(removeDuplicateList(storedtexts,wikiTextdata, "text_q"),author_birth_year, author_death_year)
        setTexts(combinedData)
        setOriginTexts(combinedData);};
        },[storedtexts, wikiTextdata])
    return (
        originTexts&&originTexts.length>0&&
        <div className="person-texts">
            <h3 onClick = {() => setExpandTexts(!expandTexts)}>{`${author_name}'s Works `}{`(${texts.length})`}</h3>
            <div className="filterTexts">
                <AuthorTextSort properties={{sortKey, setSortKey}}/>
                <AuthorTextSearch properties={{originTexts, setTexts}}/>
                <Filters texts={texts} setTexts={setTexts} filterOptions = {filterOptions} originTexts = {originTexts}/>
            </div>
            {sortList(texts,sortKey.keys, sortKey.descending).slice(0,(!expandTexts?5:texts.length)).map(
                (text) => <SubTextsTable data={text} key={text.book} author={author} handleClick={handleClick}/>)}
            {originTexts.length>5&&
                <button className="expandBtn" onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(texts.length-5) + " texts"}</button>}
        </div>   
)}

export default AuthorTexts;