//Translate author table
function authorToDict(data) {
  function transferToDict(id) {
    var dictionary = data['data'][id];
    var id_int = parseInt(id)+1
    var birth = dictionary['Birth'];
    var death = dictionary['Death'];
    var deathString
    if (death<0) {deathString= Math.abs(death)+" BC"}
    else{deathString = death+ " AD"}    
    return {
      id:id_int,
      name: dictionary['Name'],
      position: checkNull(dictionary['Position']),
      birth: checkNull(birth),
      death: checkNull(death),
      floruit: checkNull(dictionary['Floruit']),
      country: checkNull(dictionary['Country']),
      city: checkNull(dictionary['City/Region']),
      label: "#"+id_int+": "+dictionary.Name.split(",")[0] + " - " + dictionary.Position +
      " ("+Math.abs(birth)+"-"+deathString/*+", fl. " + author.floruit*/+ ") (author)",
      value:id_int,
      deathString:deathString,
    }
}
  var list = [];
  for (var n in data['data']) {list.push(transferToDict(n))}
  return list
}
//translate nulls to unknown
function checkNull(data){
    if(data === null) {data = "unknown"}
    return data}
function authorData(){
    let data = require('../data.json')
    return (authorToDict(data))
}

export default authorData;