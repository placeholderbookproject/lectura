//Translate author table
function authorToDict() {
  function transferToDict(id) {
    var dictionary = data['data'][id];
    var id_int = dictionary["index"], birth = dictionary['Birth'], death = dictionary['Death'], deathString;
    var position = checkNull(dictionary['Position']);
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
      works: dictionary["works"],
    }
}
  let data = require('../data.json')
  var list = [];
  for (var n in data['data']) {list.push(transferToDict(n))}
  return list
}
//translate nulls to unknown
function checkNull(data){
    if(data === null) {data = ""}
    return data}

function worksToDict() {
  function dictElement(id){
    var dictionary = listOfWorks[id];
    var id_int = dictionary["index"];
    var title = dictionary['title'], author = dictionary["author"], author_id = dictionary["author_index"], publication = dictionary["publication"]
    return {
      id: id_int,
      title:title,
      author:author,
      publication:publication,
      author_id:author_id,
      label: title + " (" + publication + ") (text)",
      value: id_int,
      type: "text",
    }}
    let listOfWorks = require("../works.json")["data"];
    var list = [];
    for (var n in listOfWorks){list.push(dictElement(n))}
    return list
  }
function authorData(){
    let data = {
        work: worksToDict(),
        authors: authorToDict(),
      }
    return data
}

export default authorData;