import React, {useState, useEffect} from 'react';
import {fetchDataEffect, wikidataEffect} from '../apiEffects.js';
import {transformYear, reformatWikitexts, dateCoalesce, removeDuplicateList, checkData, removeWorksOutOfBounds} from '../formattingFuncs.js';
import TableRow from '../ViewRow.js';
import labels from '../labels.js';
import ArchiveList from '../ArchiveList.js';

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
    const handleSortChange = () => {
        const oldDirection = sortKey.descending
        setSortKey({ ...sortKey, descending: !oldDirection });
    };        
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
        texts&&texts.length>0&&
        <div className="person-texts">
            <h2 onClick = {() => setExpandTexts(!expandTexts)}>{`${author.author_name}'s Texts `}{`(${texts.length})`}</h2>
            <div>
                <button id="sortKey" value={sortKey.keys} onClick={handleSortChange}>{`Sort by Publ. Year (${sortKey.descending?"Desc":"Asc"})`}</button>
            </div>
            {texts&&sortList(texts,sortKey.keys, sortKey.descending).slice(0,(!expandTexts?10:texts.length)).map(
                (text) => 
                    <SubTextsTable data={text} key={text.book} name = {author.author_name}/>)}
            {texts&&texts.length>10&&
                <button onClick = {() => setExpandTexts(!expandTexts)}>{expandTexts?"Collapse":"Show Remaining "+(texts.length-10) + " texts"}</button>}
        </div>   
)}

const SubTextsTable = (props) => {
    const {bookLabel, publYear,dopYear, inceptionYear, book, titleLabel, text_id} = props.data
    const bookLabelReform = bookLabel.split(" | ").length>1?bookLabel.split(" | ").pop():bookLabel
    const link = text_id&&"/text/"+text_id
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <div className="text-info">
            <p>
                <a href={checkData(link,book)}>{bookLabelReform}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}</a>
                <button onClick = {() => {setDetailed(!detailed)}}>{detailed?"-":"+"}</button>
            </p>
            {detailed&&<>
                <DetailedTexts data = {props.data} name={props.name}/>
                {detailed&&<ArchiveList title={bookLabelReform} name={props.name} originalTitle={titleLabel}/>}
            </>}
        </div>)
}

const DetailedTexts = (props) => {
    const { bookdesc, titleLabel, typeLabel, genreLabel, formLabel, publYear,languageLabel
        ,dopYear, inceptionYear, metreLabel, book, publisherLabel, lengthLabel} = props.data
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <>
            <TableRow>{bookdesc}</TableRow>
            <TableRow label={labels.original_title}>{titleLabel}</TableRow>
            <TableRow label={labels.written_date}>{transformYear(selectedDate)}</TableRow>
            <TableRow label={labels.language}>{languageLabel}</TableRow>
            <TableRow label={labels.genre}>{genreLabel}</TableRow>
            <TableRow label={labels.type}>{typeLabel}</TableRow>
            <TableRow label={labels.form}>{formLabel}</TableRow>
            <TableRow label={labels.metre}>{metreLabel}</TableRow>
            {lengthLabel&&<TableRow label={labels.length}>{lengthLabel + " pages"}</TableRow>}
            <TableRow label={labels.publishers}>{publisherLabel}</TableRow>
            {book&&<TableRow label={labels.wiki}><a href={book}>{book.replace("http://www.wikidata.org/entity/","")}</a></TableRow>}
        </>
    )
}

export default TextsWikiTable;