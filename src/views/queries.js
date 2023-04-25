export const externalsQuery = `
SELECT ?propertyLabel ?value WHERE { 
    ?property wikibase:propertyType wikibase:ExternalId . 
    ?property wikibase:directClaim ?propertyclaim . 
    OPTIONAL {?property wdt:P1630 ?formatterURL .}  
    wd:Q343607 ?propertyclaim ?_value .   
    BIND(IF(BOUND(?formatterURL), IRI(REPLACE(?formatterURL, "\\$", ?_value)) , ?_value) AS ?value) 
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } 
    }
`
export const authorQuery = `
    SELECT DISTINCT ?author ?authordesc ?authorLabel ?genderLabel
    ?birthdate (YEAR(?birthdate) AS ?birthyear) (MONTH(?birthdate) AS ?birthmonth) (DAY(?birthdate) AS ?birthday) ?birthplace ?birthplaceLabel ?birthplacecountryLabel
    ?deathdate (YEAR(?deathdate) as ?deathyear) (MONTH(?deathdate) as ?deathmonth) (day(?deathdate) as ?deathday) 
    ?deathplace ?deathplaceLabel ?deathplacecountry ?deathplacecountryLabel
    ?floruit
    ?occupationsLabel
    ?languagesLabel
    ?spouseLabel
    ?imageLabel
    ?nativenameLabel
    #?descriptionsourceLabel
    WHERE
    {
      VALUES ?author {wd:q_number}
      ?author schema:description ?authordesc.
      FILTER(LANG(?authordesc) = "en").
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
      #OPTIONAL {?author wdt:P1343 ?descriptionsource.}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
`
export const authorTextQuery = `
SELECT distinct ?book 
?bookLabel
?bookdesc
?titleLabel
?typeLabel
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
  ?book schema:description ?bookdesc.
  FILTER(LANG(?bookdesc)="en").
  OPTIONAL {?book wdt:P31 ?type.}
  OPTIONAL {?book wdt:P136 ?genre}
  OPTIONAL {?book wdt:P1476 ?title.}
  OPTIONAL {?book wdt:P577 ?publication.}
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
  BIND(IF(BOUND(?languagecode), ?languagecode, "en") AS ?lang)
  OPTIONAL {?book rdfs:label ?bookLabel. FILTER (lang(?bookLabel) = "en" || lang(?bookLabel) = ?lang).}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } 
  BIND(COALESCE(YEAR(?publication), YEAR(?dop), YEAR(?inception), 9999) as ?orderDate)
}
ORDER BY ASC(?orderDate)
`