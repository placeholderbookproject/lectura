import React, {/*useRef,*/ useState, useEffect} from 'react';
import { wikidataEffect } from './apiEffects';

const findIndex = (list, search) => {
  const ind = list.findIndex((obj) => obj.propertyLabel.value.includes(search))
  if(ind===-1){return null}
  return list[ind].value.value
}
const externalsStaples = [
  {logo:"https://d.gr-assets.com/misc/1454549143-1454549143_goodreads_misc.png", label: "Goodreads"}
  ,{logo:"https://openlibrary.org/static/images/openlibrary-logo-tighter.svg", label:"Open Library"}
  ,{logo:"https://sites.tufts.edu/perseuscatalog/files/2013/05/medusa_pegasus.png", label: "Perseus"}
  ,{logo:"https://catalogue.bnf.fr/images/Logo_BNF_Web.png", label:"Bibliothèque nationale de France"}
  ,{logo:"https://www.letempsretrouve.nl/wp-content/uploads/2021/06/Logo-La-Ple%CC%81iade.jpeg", label:"Bibliothèque de la Pléiade"}
  ,{logo:"https://upload.wikimedia.org/wikipedia/commons/a/a7/LibraryThing_Logo_medium.png", label:"LibraryThing"}
  ,{logo:"https://www.gutenberg.org/gutenberg/pg-logo-129x80.png", label:"Gutenberg"}
  ,{logo:"https://librivox.org/images/librivox-logo.png", label:"LibriVox"}
  ,{logo:"https://latin.packhum.org/images/ornament.png", label:"PHI Latin Texts"}
  ,{logo:"https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", label:"Google Knowledge"}
  ,{logo:"https://aboutbrepolis.files.wordpress.com/2023/04/clacla.png?w=250&h=180", label:"Clavis Patrum"}
  ,{label: "Musisque Deoque", alt: "MQDQ"}
  ,{label:"Hymnary", alt:"Hymnary"}
  ,{logo:"https://topostext.org/images/logo1_2.png", label:"ToposText", alt: "ToposText"}
]

export const WikiExternalsLabels = (props) => {
  const [externals,setExternals] = useState()
  let {q_number, language} = props;
  useEffect(() => {
    if(q_number){
        q_number = q_number.replace("http://www.wikidata.org/entity/","")
        wikidataEffect({q_number, setWikidata:setExternals, type:"externals", language})();}
  },[props.q_number])
  return (
    externals&&externals.results&&
    externalsStaples.map((external) => (
      findIndex(externals.results.bindings,external.label)&&
      <a href={findIndex(externals.results.bindings,external.label)} key={findIndex(externals.results.bindings,external.label)}>
        {external.logo&&<img src={external.logo} style={{ maxWidth: "40px", maxHeight: "30px", objectFit: "contain" }} alt={external.label}></img>}
        {!external.logo&&external.alt}
      </a>
    ))
  )
}

export const WikiExternalsList = (props) => {
  const [externals,setExternals] = useState()
  const [selectedExternal, setSelectedExternal] = useState();
  let {q_number, language} = props;
  useEffect(() => {
      if(q_number){
          q_number = q_number.replace("http://www.wikidata.org/entity/","")
          wikidataEffect({q_number, setWikidata:setExternals, type:"externals", language})();}
  },[props.q_number])
  return (
      externals&&externals.results&&
      <div className="wikiExternals">
        <select style={{maxWidth:400}} value = {selectedExternal&&selectedExternal.value} 
            label={selectedExternal&&selectedExternal.propertyLabel} onChange = {(e) => setSelectedExternal(e.target.value)}>
            {externals.results.bindings.map((option) => 
                (<option key = {option.value.value+option.propertyLabel.value} value = {option.value.value}>{option.propertyLabel.value}</option>) )}
        </select>
        <p><a href={selectedExternal&&selectedExternal}>{selectedExternal}</a></p>
      </div>
  )
}

export const externalsQuery = `
SELECT ?propertyLabel ?value WHERE { 
    ?property wikibase:propertyType wikibase:ExternalId . 
    ?property wikibase:directClaim ?propertyclaim . 
    OPTIONAL {?property wdt:P1630 ?formatterURL .}  
    wd:q_number ?propertyclaim ?_value .   
    BIND(IF(BOUND(?formatterURL), IRI(REPLACE(?formatterURL, "\\\\$1", ?_value)) , ?_value) AS ?value) 
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } 
    }
`
export const authorQuery = `
    SELECT DISTINCT ?author ?authordesc ?authorLabel ?akaLabel ?genderLabel
    ?birthdate (YEAR(?birthdate) AS ?birthyear) (MONTH(?birthdate) AS ?birthmonth) (DAY(?birthdate) AS ?birthday) ?birthplace ?birthplaceLabel ?birthplacecountryLabel
    ?deathdate (YEAR(?deathdate) as ?deathyear) (MONTH(?deathdate) as ?deathmonth) (day(?deathdate) as ?deathday) 
    ?deathplace ?deathplaceLabel ?deathplacecountry ?deathplacecountryLabel
    ?floruit
    ?occupationsLabel
    ?languagesLabel
    ?spouseLabel
    ?imageLabel
    ?nativenameLabel
    ?citizenshipLabel
    #?descriptionsourceLabel
    WHERE
    {
      VALUES ?author {wd:q_number}
      OPTIONAL{?author schema:description ?authordesc.
      FILTER(LANG(?authordesc) = "en").}
      OPTIONAL {?author skos:altLabel ?akaLabel. FILTER (lang(?akaLabel) = "en").}
      OPTIONAL {?author wdt:P569 ?birthdate.}
      OPTIONAL {?author wdt:P19 ?birthplace.
               OPTIONAL {?birthplace wdt:P17 ?birthplacecountry.}
               }
      OPTIONAL {?author wdt:P570 ?deathdate.}
      OPTIONAL {?author wdt:P20 ?deathplace.
               OPTIONAL {?deathplace wdt:P17 ?deathplacecountry.}
               }
      OPTIONAL {?author wdt:P21 ?gender}
      OPTIONAL {?author wdt:P1412 ?languages.}
      OPTIONAL {?author wdt:P6886 ?languages.}
      OPTIONAL {?author wdt:P1317 ?floruit.}
      OPTIONAL {?author wdt:P106 ?occupations.}
      OPTIONAL {?author wdt:P26 ?spouse.}
      OPTIONAL {?author wdt:P18 ?image.}
      OPTIONAL {?author wdt:P1559 ?nativename.}
      OPTIONAL {?author wdt:P27 ?citizenship.}
      #OPTIONAL {?author wdt:P1343 ?descriptionsource.}
      OPTIONAL {?author rdfs:label ?authorLabel. FILTER(LANG(?authorLabel)="en").}
      [nativeHeader]
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
`
export const authorTextQuery = `
SELECT distinct (?book as ?text_q)
?book
?bookLabel
?akaLabel
?bookdesc
?titleLabel
?typeLabel
?formLabel
?genreLabel
?image
(YEAR(?publication) as ?publYear)
?publication
?languageLabel
?origincountryLabel
(YEAR(?dop) as ?dopYear)
?inception
(YEAR(?inception) as ?inceptionYear)
?metreLabel
?publisherLabel
?lengthLabel
#?charactersLabel

WHERE
{
  VALUES ?instance { wd:Q7725634 wd:Q47461344 wd:Q571 wd:Q5185279 wd:Q49084 wd:Q8261 
                             wd:Q20540385 wd:Q25379 wd:Q386724 wd:Q23622 wd:Q149537 
                             wd:Q36279 wd:Q699 wd:Q4184 wd:Q112983 wd:Q25839930 wd:Q17518461 
                             wd:Q482 wd:Q856713 wd:Q1318295 wd:Q59126 wd:Q25372 wd:Q37484 wd:Q58854 
                             wd:Q241996 wd:Q8242 wd:Q40831 wd:Q182659 wd:Q24723 wd:Q80930 wd:Q182357 
                             wd:Q44342 wd:Q128758 wd:Q114375 wd:Q208628 wd:Q1640824 wd:Q179461 wd:Q17518870
}.
  ?book wdt:P50 wd:q_number.
  ?book wdt:P31 ?instance.
  OPTIONAL{?book schema:description ?bookdesc.
  FILTER(LANG(?bookdesc)= "en").}
  OPTIONAL {?book skos:altLabel ?akaLabel. FILTER (lang(?akaLabel) = "en").}
  OPTIONAL {?book wdt:P31 ?type.}
  OPTIONAL {?book wdt:P7937 ?form.}
  OPTIONAL {?book wdt:P136 ?genre}
  OPTIONAL {?book wdt:P1476 ?title.}
  OPTIONAL {?book wdt:P577 ?publication.}
  OPTIONAL {?book wdt:P18 ?image.}
  OPTIONAL { ?book wdt:P407 ?language. 
    ?language wdt:P424 ?languagecode.
    }
OPTIONAL {?book wdt:P495 ?origincountry.}
  OPTIONAL {?book wdt:P571 ?inception.}
  OPTIONAL {?book wdt:P1191 ?dop.}
  OPTIONAL {?book wdt:P571 ?inception.}
  OPTIONAL {?book wdt:P2551 ?metre.}
  OPTIONAL {?book wdt:P123 ?publisher}
  #OPTIONAL {?book wdt:P674 ?characters.}
  OPTIONAL {?book wdt:P1104 ?length.}
  OPTIONAL {{#Checks if language exists
    SELECT DISTINCT ?language ?languagecode
    WHERE {
        wd:[q2] (wdt:P1412|wdt:P6886) ?language.
        ?language wdt:P424 ?languagecode
    }
  }}
  OPTIONAL {?book rdfs:label ?bookLabel. FILTER (lang(?bookLabel) = "en").}
  OPTIONAL  {?language wdt:P424 ?lang. ?book rdfs:label ?bookLabel. FILTER (lang(?bookLabel) != "en" && lang(?bookLabel) = ?lang).}
  OPTIONAL {?language wdt:P424 ?lang. BIND(SUBSTR(?lang,2) AS ?langsim). ?book rdfs:label ?bookLabel. FILTER (lang(?bookLabel) != "en" && lang(?bookLabel) = ?langsim). }
  OPTIONAL {?book rdfs:label ?bookLabel. FILTER(lang(?bookLabel)="en_fixed").}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } 
  BIND(COALESCE(YEAR(?publication), YEAR(?dop), YEAR(?inception), 9999) as ?orderDate)
}
ORDER BY ASC(?orderDate)
`

export const textQuery = `
SELECT distinct (?book as ?text_q)
?author
?bookLabel
?authorLabel
?image
?akaLabel
?bookdesc
?titleLabel
?typeLabel
?formLabel
?genreLabel
(YEAR(?publication) as ?publYear)
?publication
?languageLabel
?origincountryLabel
(YEAR(?dop) as ?dopYear)
?inception
(YEAR(?inception) as ?inceptionYear)
?metreLabel
?publisherLabel
?lengthLabel
?timeperiodLabel
?awardsLabel
#?charactersLabel
?publishedInLabel
?copyrightLabel
#?charactersLabel

WHERE
{
  VALUES ?book { wd:q_number}.
  ?book wdt:P50 ?author.
  OPTIONAL {?book wdt:P18 ?image.}
  OPTIONAL{?book schema:description ?bookdesc. FILTER(LANG(?bookdesc)= "en").}
  OPTIONAL {?book skos:altLabel ?akaLabel. FILTER (lang(?akaLabel) = "en").}
  OPTIONAL {?book wdt:P31 ?type.}
  OPTIONAL {?book wdt:P7937 ?form.}
  OPTIONAL {?book wdt:P136 ?genre}
  OPTIONAL {?book wdt:P1476 ?title.}
  OPTIONAL {?book wdt:P577 ?publication.}
  OPTIONAL { ?book wdt:P407 ?language. ?language wdt:P424 ?languagecode.}
  OPTIONAL {?book wdt:P495 ?origincountry.}
  OPTIONAL {?book wdt:P571 ?inception.}
  OPTIONAL {?book wdt:P1191 ?dop.}
  OPTIONAL {?book wdt:P571 ?inception.}
  OPTIONAL {?book wdt:P2551 ?metre.}
  OPTIONAL {?book wdt:P123 ?publisher}
  OPTIONAL {?book wdt:P2408 ?timeperiod.}
  OPTIONAL {?book wdt:P166 ?awards.}
  #OPTIONAL {?book wdt:P674 ?characters.}
  OPTIONAL {?book wdt:P1104 ?length.}
  #OPTIONAL {?book wdt:P674 ?characters.}
  OPTIONAL {?book wdt:P1433 ?publishedIn.}
  OPTIONAL {?book wdt:P6216 ?copyright.}
  OPTIONAL {?book rdfs:label ?bookLabel. FILTER(LANG(?bookLabel)="en").}
[nativeHeader]
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  #BIND(COALESCE(YEAR(?publication), YEAR(?dop), YEAR(?inception), 9999) as ?orderDate)
}
#ORDER BY ASC(?orderDate)`

export default WikiExternalsList