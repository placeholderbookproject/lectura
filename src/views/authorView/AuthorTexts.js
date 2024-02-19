import React, {useState, useEffect} from 'react';
import {removeWorksOutOfBounds, getUniquePropertyValues} from '../formattingFuncs.js';
import Filters from '../Filter.js';
import SubTextsTable from './SubTextsTable.js';
import AuthorTextSearch from './AuthorTextSearch.js';
import AuthorTextSort,{sortList} from './AuthorTextSort.js';

const AuthorTexts = (props) => {
    const {author, handleClick, userData, setUserData} = props.properties
    const {author_birth_year, author_death_year, author_name} = author
    const [expandTexts, setExpandTexts] = useState(false)
    const [originTexts, setOriginTexts] = useState([])
    const [texts, setTexts] = useState(removeWorksOutOfBounds(props.properties.texts,author_birth_year,author_death_year)); //Combined
    const [sortKey, setSortKey] = useState({ keys: ['publYear', 'dopYear', 'inceptionYear'] });
    const filterOptions = texts && [{label: 'Form', property: 'formLabel', values: getUniquePropertyValues(texts, 'formLabel') },
                                    {label: 'Language', property: 'languageLabel', values: getUniquePropertyValues(texts, 'languageLabel') },
                                    {label: 'Genre', property: 'genreLabel', values: getUniquePropertyValues(texts, 'genreLabel') },];
    useEffect(() => {setOriginTexts(removeWorksOutOfBounds(props.properties.texts,author_birth_year,author_death_year))},[props.properties.texts])
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