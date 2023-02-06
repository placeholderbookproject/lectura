//Translate author table
const authorToDict = () => {
  const transferToDict = (id) => {
    const dictionary = data['data'][id];
    let id_int = dictionary["index"], birth = dictionary['Birth'], death = dictionary['Death'], deathString;
    const position = checkNull(dictionary['Position']);
    if (death<0) {deathString= Math.abs(death)+" BC"}
    else{deathString = death+ " AD"}    
    return {
      id:id_int,
      name: dictionary['Name'],
      position: position,
      birth: checkNull(birth),
      death: checkNull(death),
      floruit: checkNull(dictionary['Floruit']),
      country: checkNull(dictionary['Country']),
      city: checkNull(dictionary['City/Region']),
      label: /*"#"+id_int+": "+*/dictionary.Name.split(",")[0] + " - " + position.split(",")[0] +
      " ("+Math.abs(birth)+"-"+deathString/*+", fl. " + author.floruit*/+ ") (author)",
      value:id_int,
      deathString:deathString,
      type: "author",
      texts: dictionary["texts"],
    }
}
  let data = require('../data.json')
  let list = [];
  for (let n in data['data']) {list.push(transferToDict(n))}
  return list
}
//translate nulls to unknown
const checkNull = (data) => {
    if(data === null) {data = ""}
    return data}

const textsToDict = () => {
  const dictElement = (id) => {
    const dictionary = listOfTexts[id];
    const {title, author, author_index, publication, index, editions} = dictionary
    return {
      id: index,
      title:title,
      author:author,
      publication:publication,
      author_id:author_index,
      label: title + " (" + (publication>0?publication + " AD":publication!==""? Math.abs(publication) + " BC": " unspecified") + ") (text)",
      value: index,
      type: "text",
      editions: editions,
    }}
    let listOfTexts = require("../texts.json")["data"];
    let list = [];
    for (let n in listOfTexts){list.push(dictElement(n))}
    return list
  }

const editionsToDict = () => {
  const dictElement = (id) => {
    const dictionary = listOfEditions[id];
    const {index,title, original_title, author, additional_authors, ISBN, ISBN13, publisher, binding, 
      number_of_pages, publication_year, original_publication_year, language, text_index} = dictionary
    return {
      id:index,
      title:title,
      original_title:original_title,
      author:author,
      additional_authors:additional_authors,
      isbn: ISBN,
      isbn13: ISBN13,
      publisher: publisher,
      binding: binding,
      number_of_pages:number_of_pages,
      publication_year: publication_year,
      original_publication_year: original_publication_year,
      language:language,
      text_index: text_index,
      label: '',
      value: index,
    }}
    let listOfEditions = require("../editions.json")["data"];
    let list = []
    for (let n in listOfEditions){
      if(n.text_index !== ""){list.push(dictElement(n))}
    }
    return list
  }



const authorData = () => {
    let data = {
        texts: textsToDict(),
        authors: authorToDict(),
        editions: editionsToDict(),
      }
    return data
}

export default authorData;