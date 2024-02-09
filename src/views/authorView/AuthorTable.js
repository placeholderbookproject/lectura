import React, {useState, useEffect} from 'react';
import TableRow from '../ViewRow.js';
import labels from '../labels.js';
import {checkStr, transformYear, checkData} from '../formattingFuncs.js';
import { WikiExternalsLabels } from '../wikidata.js';

export const AuthorTable = (props) => {
    const {author, lang} = props.properties
    const [data, setData] = useState({...author})
    useEffect(()=>{if(author){setData({...author});}},[author])
    const language = lang.value
    const {authordesc, akaLabel,genderLabel, birthyear, birthplaceLabel, birthplacecountryLabel,deathyear
        ,deathplaceLabel,deathplacecountryLabel, floruit, occupationsLabel, languagesLabel, nativenameLabel, imageLabel,citizenshipLabel
        ,author_q, author_name, author_nationality, author_birth_year, author_birth_city, author_birth_country,
        author_death_year, author_death_city, author_death_country, author_floruit, author_positions, author_name_language
    } = data;
    const name = author && author_name ? author_name.split(",") : "";
    const numNames = name.length;
    const akaWiki = akaLabel&&(akaLabel.split(", ").length>5?akaLabel.split(", ").slice(0,4).join(", "):akaLabel)
    return (
        name&&
        <div id="authorTableWindow" className="person-info" style={{backgroundColor:"white"}}>
                {author_q&&<WikiExternalsLabels q_number={author_q} language={language}/>}
                <TableRow label = {labels.aka + " "}>{checkData(akaWiki,numNames>1?name.slice(1,numNames).join(", "):null)}</TableRow>
                {nativenameLabel&&<TableRow label = {labels.nativeName + " "}>{nativenameLabel}{genderLabel&&` (${genderLabel})`}</TableRow>}
                <div>{imageLabel && <img src={imageLabel.split(", ")[0]} className="author-img"/>}</div>
                {authordesc&&<p>{authordesc}</p>}
            {author&&
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

export default AuthorTable;