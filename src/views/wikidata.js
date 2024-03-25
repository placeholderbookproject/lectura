import React, {useState, useEffect} from 'react';
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
  ,{logo:"https://isni.oclc.org:2443/isni/psi_images/img_psi/3.0/logos/logo_xml_isni.png", label:"ISNI", alt:"isni"}
]

export const WikiExternalsLabels = ({q_number, language}) => {
  const [externals,setExternals] = useState()
  useEffect(() => {
    if(q_number){
        wikidataEffect({q_number:q_number.replace("http://www.wikidata.org/entity/",""), setWikidata:setExternals, type:"externals", language})();}
  },[q_number, language])
  return (
    externals&&externals.results&&
      externalsStaples.map((external) => (
        findIndex(externals.results.bindings,external.label)&&
        <a href={findIndex(externals.results.bindings,external.label)} key={findIndex(externals.results.bindings,external.label)}>
          {external.logo&&<img src={external.logo} style={{ maxWidth: "40px", maxHeight: "30px", objectFit: "contain" }} alt={external.label}></img>}
          {!external.logo&&external.alt}
        </a>
    )))
}

export const WikiExternalsList = ({q_number, language}) => {
  const [externals,setExternals] = useState()
  const defaultExternal = externals&&externals.results.bindings.length===1&&externals.results.bindings[0].value.value;
  const [selectedExternal, setSelectedExternal] = useState(defaultExternal);
  useEffect(() => {
      if(q_number){
        wikidataEffect({q_number:q_number.replace("http://www.wikidata.org/entity/",""), setWikidata:setExternals, type:"externals", language:language})();}
  },[q_number, language])
  return (
      externals&&externals.results.bindings.length>0&&
        <div className="wikiExternals">
          <p className="viewRow"><span style = {{"fontWeight": 600,}}>{"External Identifiers"}</span></p>
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
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[en]". } 
    }`

export const authorQuery = `
    SELECT DISTINCT (?author as ?author_q) ?authordesc ?authorLabel ?akaLabel ?genderLabel
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
    ?article
    #?descriptionsourceLabel
    WHERE
    {
      VALUES ?author {wd:q_number}
      OPTIONAL{?author schema:description ?authordesc.
      FILTER(LANG(?authordesc) = "[en]").}
      OPTIONAL {?author skos:altLabel ?akaLabel. FILTER (lang(?akaLabel) = "[en]").}
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
      OPTIONAL {?author rdfs:label ?authorLabel. FILTER(LANG(?authorLabel)="[en]").}
      OPTIONAL {
        ?article schema:about ?author .
        ?article schema:inLanguage "[en]" .
        FILTER (SUBSTR(str(?article), 1, 25) = "https://[en].wikipedia.org/")
      }  
      [nativeHeader]
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[en]". }
    }`

export const authorTextQuery = `
SELECT distinct (?book as ?text_q)
?book
?bookLabel
?author
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
WHERE
{
  ?book wdt:P50 ?author.
  VALUES ?author {wd:q_number}
  OPTIONAL {?book wdt:P31 ?instance.}
  FILTER (!(BOUND(?instance) && ?instance IN (wd:Q13442814, wd:Q13433827, wd:Q7318358, wd:Q1935136
      ,wd:Q1907875, wd:Q19389637, wd:Q3331189, wd:Q191067, wd:Q1980247, wd:Q18918145, wd:Q1504425)))
  OPTIONAL{?book schema:description ?bookdesc.
  FILTER(LANG(?bookdesc)= "[en]").}
  OPTIONAL {?book skos:altLabel ?akaLabel. FILTER (lang(?akaLabel) = "[en]").}
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
  OPTIONAL {?book rdfs:label ?bookLabel. FILTER (lang(?bookLabel) = "[en]").}
  OPTIONAL  {?language wdt:P424 ?lang. ?book rdfs:label ?bookLabel. FILTER (lang(?bookLabel) != "[en]" && lang(?bookLabel) = ?lang).}
  OPTIONAL {?language wdt:P424 ?lang. BIND(SUBSTR(?lang,2) AS ?langsim). ?book rdfs:label ?bookLabel. FILTER (lang(?bookLabel) != "[en]" && lang(?bookLabel) = ?langsim). }
  OPTIONAL {?book rdfs:label ?bookLabel. FILTER(lang(?bookLabel)="en_fixed").}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[en]". } 
  BIND(COALESCE(YEAR(?publication), YEAR(?dop), YEAR(?inception), 9999) as ?orderDate)
}
ORDER BY ASC(?orderDate)`

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
?publishedInLabel
?copyrightLabel
?article
?source
WHERE
{
  VALUES ?book { wd:q_number}.
  ?book wdt:P50 ?author.
  OPTIONAL {?book wdt:P18 ?image.}
  OPTIONAL{?book schema:description ?bookdesc. FILTER(LANG(?bookdesc)= "[en]").}
  OPTIONAL {?book skos:altLabel ?akaLabel. FILTER (lang(?akaLabel) = "[en]").}
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
  OPTIONAL {?book rdfs:label ?bookLabel. FILTER(LANG(?bookLabel)="[en]").}
  OPTIONAL {
    ?article schema:about ?book .
    ?article schema:inLanguage "[en]" .
    FILTER (SUBSTR(str(?article), 1, 25) = "https://[en].wikipedia.org/")
  }
  OPTIONAL {
    ?source schema:about ?book .
    ?source schema:inLanguage "[en]" .
    FILTER (STRSTARTS(STR(?source), "https://[en].wikisource.org/"))  } 
[nativeHeader]
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[en]". }
  #BIND(COALESCE(YEAR(?publication), YEAR(?dop), YEAR(?inception), 9999) as ?orderDate)
}
#ORDER BY ASC(?orderDate)`

export default WikiExternalsList