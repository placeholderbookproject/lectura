import React, {useState, useEffect} from 'react';
import {fetchDataEffect, extractWiki} from '../apiEffects.js';
import {removeDuplicatesList, removeWorksOutOfBounds, getUniquePropertyValues} from '../formattingFuncs.js';
import Filters from '../Filter.js';
import SubTextsTable from './SubTextsTable.js';
import AuthorTextSearch from './AuthorTextSearch.js';
import AuthorTextSort,{sortList} from './AuthorTextSort.js';

const AuthorTexts = (props) => {
    const {author, language, handleClick, userData, setUserData} = props.properties
    const {author_birth_year, author_death_year, author_name, author_q, author_id} = author
    const [expandTexts, setExpandTexts] = useState(false)
    const [originTexts, setOriginTexts] = useState()
    const [texts, setTexts] = useState(); //Combined
    const [sortKey, setSortKey] = useState({ keys: ['publYear', 'dopYear', 'inceptionYear'] });
    const filterOptions = texts && [{label: 'Form', property: 'formLabel', values: getUniquePropertyValues(texts, 'formLabel') },
                                    {label: 'Language', property: 'languageLabel', values: getUniquePropertyValues(texts, 'languageLabel') },
                                    {label: 'Genre', property: 'genreLabel', values: getUniquePropertyValues(texts, 'genreLabel') },];
    useEffect (() => 
        {if(author&&author_q) {
            fetchDataEffect({setData:setTexts, id:author_id, type:'texts', by: "author", user_id:userData.user_id})()
            .then(results => extractWiki(results,author_q, "author_texts",language.value, "text_q"))
            .then(wiki => {return removeWorksOutOfBounds(removeDuplicatesList(wiki,"text_q"),author_birth_year,author_death_year)})
            .then(final => {setTexts(final); setOriginTexts(final)});
                    }}
    ,[author_q, language])
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
                (text) => <SubTextsTable data={text} key={text.book} author={author} handleClick={handleClick} userData={userData} setUserData={setUserData}/>)}
            {texts.length>5&&
                <button className="expandBtn" onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":`Show Remaining ${(texts.length-5)} texts`}</button>}
        </div>   
)}

export default AuthorTexts;