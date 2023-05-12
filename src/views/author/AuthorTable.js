import React, {useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import TableRow from '../ViewRow.js';
import labels from '../labels.js';
import {fetchDataEffect, wikidataEffect} from '../apiEffects.js';
import {checkStr, transformYear, reformatWikidata, checkData} from '../formattingFuncs.js';
import WikiExternalsList  from '../wikidata.js';
import TextsWikiTable from './AuthorTexts.js';

export const AuthorComponent = (props) => {
    const [q, setQ] = useState();
    const [externalStaples, setExternalStaples] = useState();
    const [author, setAuthor] = useState();
    return (
        <div className="dropdowns-container">
            <div>
                <AuthorTable setQ={setQ} lang={props.lang} externalStaples={externalStaples} setAuthor={setAuthor}/>
                {q&&<WikiExternalsList q_number={q} language={props.lang.value} setExternalStaples={setExternalStaples}/>}
            </div>
            {author&&<TextsWikiTable author = {author} language={props.lang}/>}
        </div>
    )
}

export const AuthorTable = (props) => {
    const language = props.lang.value
    const [data, setData] = useState({});
    const [wikidata, setWikidata] = useState();
    const authorReform = wikidata?reformatWikidata(wikidata):{};
    const {authordesc, authorLabel, akaLabel,genderLabel, birthyear, birthplaceLabel, birthplacecountryLabel,
        deathyear, deathplaceLabel,deathplacecountryLabel, floruit, occupationsLabel, languagesLabel, nativenameLabel, imageLabel
        ,citizenshipLabel} 
        = authorReform;
    const {author_q, author_name, author_nationality, author_birth_year, author_birth_city, author_birth_country,
        author_death_year, author_death_city, author_death_country, author_floruit, author_positions, author_name_language
    } = data
    let { id } = useParams();
    props.id?id=props.id:void(0);
    const name = data && author_name ? author_name.split(",") : "";
    const numNames = name.length;
    const akaWiki = akaLabel&&(akaLabel.split(", ").length>5?akaLabel.split(", ").slice(0,4).join(", "):akaLabel)
    useEffect(() => {
        if(data && author_q){
            props.setQ&&props.setQ(author_q);
            const q_number = author_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"author", language})();}
    },[data, language])
    useEffect(() => {
                fetchDataEffect({type:'authors', id, setData})();
                setData(id);
    }, [id]);
    useEffect(() => {props.setAuthor&&props.setAuthor(data)},[data])
    return (
        name&&
        <div id = "authorTableWindow" className="person-info" style={{backgroundColor:"white"}}>
                {props.externalStaples&&props.externalStaples}
                <h2 className ="Header">{checkData(authorLabel,name[0]) + " "}
                    {data && author_q&&<a href={data && author_q?author_q:""}>{`(Wiki)`}</a>}
                </h2>
                <TableRow label = {labels.aka + " "}>{checkData(akaWiki,numNames>1?name.slice(1,numNames).join(", "):null)}</TableRow>
                {nativenameLabel&&<TableRow label = {labels.nativeName + " "}>{nativenameLabel}{genderLabel&&` (${genderLabel})`}</TableRow>}
                {imageLabel && <img src={imageLabel.split(", ")[0]} style={{ maxWidth: "400px", maxHeight: "200px", objectFit: "contain" }} />}
                {authordesc&&<p>{authordesc}</p>}
            {data&&
                <>
                    <TableRow label = {labels.nationality + " "}>{checkData(citizenshipLabel,author_nationality)}</TableRow>
                    <TableRow label = {labels.born + " "}>
                        {transformYear(checkData(birthyear&&birthyear.split(", ").pop(),author_birth_year), labels.unspecified)}
                        {" " +checkStr(checkData(birthplaceLabel,author_birth_city), checkData(birthplacecountryLabel,author_birth_country))}
                    </TableRow>
                    <TableRow label = {labels.died + " "}>
                        {transformYear(checkData(deathyear&&deathyear.split(", ").pop(),author_death_year), labels.unspecified)}
                        {" " + checkStr(checkData(deathplaceLabel,author_death_city), checkData(deathplacecountryLabel,author_death_country))}
                    </TableRow>
                        {(author_birth_year === null|author_death_year === null) && author_floruit !==null
                            ?<TableRow label = {labels.floruit + " "}>{checkData(floruit,author_floruit)}</TableRow>:<></>}
                    <TableRow label = {labels.occupation + " "}>{checkData(occupationsLabel,author_positions)}</TableRow>
                    <TableRow label={labels.languages + " "}>{checkData(languagesLabel, author_name_language)}</TableRow>
                </>}
        </div>
    );
  }

export default AuthorComponent;