import React, {useState, useEffect} from 'react';
import {fetchDataEffect, wikidataEffect} from '../apiEffects.js';
import {transformYear, reformatWikitexts, dateCoalesce, removeDuplicateList, checkData, removeWorksOutOfBounds} from '../formattingFuncs.js';
import TableRow from '../ViewRow.js';
import labels from '../labels.js';
import ArchiveList from '../ArchiveList.js';
import Filters from '../Filter.js';

const TextsWikiTable = (props) => {
    const {author, language} = props
    const [wikiTextdata, setWikiTextdata] = useState();
    const [storedtexts,setStoredtexts] = useState();
    const [expandTexts, setExpandTexts] = useState(false)
    const [sortKey, setSortKey] = useState({ keys: ['publYear', 'dopYear', 'inceptionYear'] });
    const [texts, setTexts] = useState();
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
    const handleSortChange = () => {setSortKey({ ...sortKey, descending: !sortKey.descending });};  
    const filterOptions = texts && [{ label:"Form",property: "formLabel",values: 
                    [...new Set(texts.reduce((acc, element) => {
                        const forms = element.formLabel?element.formLabel.split(" | "):[];
                        return [...acc, ...forms];}, []))],},
                        {label:"Language",property: "languageLabel",values: [...new Set(texts.reduce((acc, element) => {
                            const languages = element.languageLabel?element.languageLabel.split(" | "):[];
                            return [...acc, ...languages];}, []))],},
                        { label:"Genre",property: "genreLabel",values: [...new Set(texts.reduce((acc, element) => {
                            const languages = element.genreLabel?element.genreLabel.split(" | "):[];
                            return [...acc, ...languages];}, []))]}
                        ];
    useEffect (() => {if(author&&author.author_q) {
                        fetchDataEffect({setData:setStoredtexts, id:author.author_id, type:'texts', by: "author"})();
                        wikidataEffect({q_number:author.author_q.replace('http://www.wikidata.org/entity/','')
                            ,setWikidata:setWikiTextdata,type:"author_texts", language:language.value})();
                    }}
    ,[author, language])
    const textsReform = wikiTextdata&&reformatWikitexts(wikiTextdata);
    useEffect(() => {storedtexts&&author
            &&setTexts(removeWorksOutOfBounds(removeDuplicateList(storedtexts,textsReform, "text_q"),author.author_birth_year, author.author_death_year))}
        ,[storedtexts, wikiTextdata])
    return (
        texts&&storedtexts.length>0&&
        <div className="person-texts">
            <h3 onClick = {() => setExpandTexts(!expandTexts)}>{`${author.author_name}'s Works `}{`(${texts.length})`}</h3>
            <div className="filterTexts">
                <button className="reorderBtn" value={sortKey.keys} onClick={handleSortChange}>
                    {`Sort by Publ. (${sortKey.descending?"Desc":"Asc"})`}
                </button>
                <Filters texts={removeWorksOutOfBounds(removeDuplicateList(storedtexts,textsReform, "text_q"),author.author_birth_year, author.author_death_year)} 
                    setTexts={setTexts} filterOptions = {filterOptions}    />
            </div>
            {texts&&texts.length>0&&sortList(texts,sortKey.keys, sortKey.descending).slice(0,(!expandTexts?5:texts.length)).map(
                (text) => <SubTextsTable data={text} key={text.book} name = {author.author_name}/>)}
            {texts&&texts.length>5&&
                <button className="expandBtn" onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(texts.length-5) + " texts"}</button>}
        </div>   
)}

const SubTextsTable = (props) => {
    const {bookLabel, text_id,bookdesc, titleLabel, typeLabel, genreLabel, formLabel, publYear,languageLabel
        ,dopYear, inceptionYear, metreLabel, book, publisherLabel, lengthLabel, image} = props.data
    const bookLabelReform = bookLabel.split(" | ").length>1?bookLabel.split(" | ").pop():bookLabel
    const link = text_id&&"/text/"+text_id
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    const rows = [{label:"",content:bookdesc},{label:labels.original_title,content:titleLabel}
                ,{label:labels.written_date,content:transformYear(selectedDate)},{label:labels.language,content:languageLabel}
                ,{label:labels.genre,content:genreLabel},{label:labels.type, content:typeLabel}
                ,{label:labels.form, content:formLabel},{label:labels.metre,content:metreLabel}
            ,{label:labels.length, content:lengthLabel&&lengthLabel+ " pages"},{label:labels.publishers,content:publisherLabel}
            ,{label:labels.wiki, content:<a href={book}>{book&&book.replace("http://www.wikidata.org/entity/","")}</a>}]
    return (
        <div className="text-info">
            <p className="textBox">
                {image && <img src={image.split("| ")[0]} style={{ width: "50px", height: "75px", objectFit: "contain" }} alt="img" />}
                <div className="textInfo">
                    <a href={checkData(link,book)} className = "textRow">{bookLabelReform}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}</a>
                    <p className="textRowSub">{bookdesc}</p>
                </div>
                <button onClick = {() => {setDetailed(!detailed)}} className="collapsible">{detailed?"-":"+"}</button>
            </p>
            {detailed&&<>
                {rows.map((row) => (row.content&&<TableRow label={row.label} key={row.content}>{row.content}</TableRow>))}
                {detailed&&<ArchiveList title={bookLabelReform} name={props.name} originalTitle={titleLabel}/>}
            </>}
        </div>)
}

export default TextsWikiTable;