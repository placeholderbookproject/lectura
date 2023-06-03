import React, {useState, useEffect} from 'react';
import {fetchDataEffect, wikidataEffect} from '../apiEffects.js';
import {reformatWikitexts, removeDuplicateList, removeWorksOutOfBounds, getUniquePropertyValues} from '../formattingFuncs.js';
import Filters from '../Filter.js';
import SubTextsTable from './SubTextsTable.js';

const TextsWikiTable = (props) => {
    const {author, language, handleClick} = props
    const {author_birth_year, author_death_year, author_name, author_q, author_id} = author
    const [wikiTextdata, setWikiTextdata] = useState();
    const [storedtexts,setStoredtexts] = useState();
    const [expandTexts, setExpandTexts] = useState(false)
    const [sortKey, setSortKey] = useState({ keys: ['publYear', 'dopYear', 'inceptionYear'] });
    const [texts, setTexts] = useState();
    const [search, setSearch] = useState("");
    const sortList = (list,keys, descending) => {
        return list.map((element) => {
            const priorityKey = keys.find((key) => element[key]);
            return { ...element, priorityKey:element[priorityKey]};
          }).sort((a, b) => {
            if (a.priorityKey < b.priorityKey) {return descending?-1:1;}
            if (a.priorityKey > b.priorityKey) {return descending?1:-1;}
            return 0;
          });
    }
    useEffect(() => {
        const toSearch = storedtexts&&author&& removeWorksOutOfBounds(removeDuplicateList(storedtexts,textsReform, "text_q"),author_birth_year, author_death_year)
        if(search==="") {setTexts(toSearch)}
        else if(texts && search) {
            const results = toSearch.filter((item) => item.bookLabel.toLowerCase().includes(search.toLowerCase()))//Object.values(item).some((bookLabel) => bookLabel === search))
            setTexts(results);
        }
    },[search])
    const handleSortChange = () => {setSortKey({ ...sortKey, descending: !sortKey.descending });};  
    const filterOptions = texts && [
        {label: 'Form', property: 'formLabel', values: getUniquePropertyValues(texts, 'formLabel') },
        {label: 'Language', property: 'languageLabel', values: getUniquePropertyValues(texts, 'languageLabel') },
        {label: 'Genre', property: 'genreLabel', values: getUniquePropertyValues(texts, 'genreLabel') },];
    useEffect (() => {if(author&&author_q) {
                        fetchDataEffect({setData:setStoredtexts, id:author_id, type:'texts', by: "author"})();
                        wikidataEffect({q_number:author_q.replace('http://www.wikidata.org/entity/','')
                        ,setWikidata:setWikiTextdata,type:"author_texts", language:language.value})();
                    }}
    ,[author, language])
    const textsReform = wikiTextdata&&reformatWikitexts(wikiTextdata);
    useEffect(() => {storedtexts&&author
            &&setTexts(removeWorksOutOfBounds(removeDuplicateList(storedtexts,textsReform, "text_q"),author_birth_year, author_death_year))}
        ,[storedtexts, wikiTextdata])
    return (
        texts&&storedtexts.length>0&&
        <div className="person-texts">
            <h3 onClick = {() => setExpandTexts(!expandTexts)}>{`${author_name}'s Works `}{`(${texts.length})`}</h3>
            <div className="filterTexts">
                <button className="reorderBtn" value={sortKey.keys} onClick={handleSortChange}>
                    {`Sort by Publ. (${sortKey.descending?"Desc":"Asc"})`}
                </button>
                {storedtexts.length>5&&<input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}></input>}
                <Filters texts={texts} setTexts={setTexts} filterOptions = {filterOptions}/>
            </div>
            {texts&&texts.length>0&&sortList(texts,sortKey.keys, sortKey.descending).slice(0,(!expandTexts?5:texts.length)).map(
                (text) => <SubTextsTable data={text} key={text.book} author = {author} handleClick={handleClick}/>)}
            {texts.length>5&&
                <button className="expandBtn" onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(texts.length-5) + " texts"}</button>}
        </div>   
)}

export default TextsWikiTable;