import React, {useState, useEffect} from 'react';
import {fetchDataEffect, wikidataEffect} from '../apiEffects.js';
import {transformYear, reformatWikitexts, dateCoalesce, removeDuplicateList, removeWorksOutOfBounds, getUniquePropertyValues} from '../formattingFuncs.js';
import TableRow from '../ViewRow.js';
import labels from '../labels.js';
import ArchiveList from '../ArchiveList.js';
import Filters from '../Filter.js';

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
        const toSearch = storedtexts&&author&&  removeWorksOutOfBounds(removeDuplicateList(storedtexts,textsReform, "text_q"),author_birth_year, author_death_year)
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
                <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                <Filters texts={removeWorksOutOfBounds(removeDuplicateList(storedtexts,textsReform, "text_q"),author_birth_year, author_death_year)} 
                    setTexts={setTexts} filterOptions = {filterOptions}/>
            </div>
            {texts&&texts.length>0&&sortList(texts,sortKey.keys, sortKey.descending).slice(0,(!expandTexts?5:texts.length)).map(
                (text) => <SubTextsTable data={text} key={text.book} author = {author} handleClick={handleClick}/>)}
            {texts&&texts.length>5&&
                <button className="expandBtn" onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(texts.length-5) + " texts"}</button>}
        </div>   
)}

const SubTextsTable = (props) => {
    const {bookLabel, text_id,bookdesc, titleLabel, typeLabel, genreLabel, formLabel, publYear,languageLabel
        ,dopYear, inceptionYear, metreLabel, book, publisherLabel, lengthLabel, image} = props.data
    const {author_name, author_id} = props.author
    const bookLabelReform = bookLabel.split(" | ").length>1?bookLabel.split(" | ").pop():bookLabel
    const link = text_id&&("/author/"+author_id+"/text/"+text_id)
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    const rows = [{label:labels.original_title,content:titleLabel},{label:labels.written_date,content:transformYear(selectedDate)}
                ,{label:labels.language,content:languageLabel},{label:labels.genre,content:genreLabel},{label:labels.type, content:typeLabel}
                ,{label:labels.form, content:formLabel},{label:labels.metre,content:metreLabel}
            ,{label:labels.length, content:lengthLabel&&lengthLabel+ " pages"},{label:labels.publishers,content:publisherLabel}
            ,{label:labels.wiki, content:<a href={book}>{book&&book.replace("http://www.wikidata.org/entity/","")}</a>}]
    return (
        <div className="text-info">
            <div className="textBox">
                {image && <img src={image.split("| ")[0]} className="textImg" alt="img" />}
                <div className="textInfo">
                    <a className="textRow" onClick = {() => {props.handleClick(text_id&&text_id);!text_id&&setDetailed(!detailed)}}>
                        {bookLabelReform}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}
                    </a>
                    <p className="textRowSub">{bookdesc}</p>
                </div>
            </div>           
                {detailed&&<div className="textRowDetailed">
                    {rows.map((row) => (row.content&&<TableRow label={row.label} key={row.content}>{row.content}</TableRow>))}
                    {detailed&&<ArchiveList title={bookLabelReform} name={author_name} originalTitle={titleLabel}/>}
                </div>}
        </div>)
}

export default TextsWikiTable;