import React from 'react';

function AuthorTable (props){
    //Creates the author "view"
    const author = props.data;
    var name = author.name.split(",");
    var floruit = "";
    if ((author.birth === ("unknown")|author.death === ("unknown")) && author.floruit !==("unknown")) {floruit = "floruit: " + author.floruit}
    var aka = "";
    var numNames = name.length;
    var birth = author.birth
    var death = author.death
    if (death<0) {death = Math.abs(death)+" BC";}
    else{death = death+ " AD";}
    if (birth<0){birth = Math.abs(birth) + " BC";}
    else {birth = birth + " AD";}
    if (numNames > 1){aka = "aka. "+name.slice(1,numNames).join(", ")}
    return (
      (<table id = "authorTableWindow"><tbody>
        <tr className = "Header"><td>{name[0]}</td></tr>
        <tr><td>{aka}</td></tr>
        <tr>
          <td><span style={{"fontWeight": '700'}}>born: </span> {birth+" ("+author.city+", "+author.country + ")"}</td>
        </tr>
        <tr>
          <td><span style = {{"fontWeight":'700'}}>died:</span> {death}</td>
        </tr>
        <tr><td>{floruit}</td></tr>
        <tr><td>{""}</td></tr>
        <tr><td>{author.position}</td></tr>
        <tr><td>{"For biographical details, see "}<a href = {"https://www.google.com/search?q="+name[0]}>google</a></td>
          </tr>
        <tr className = {"Works"}><td>{"List of known works"}</td></tr>
        </tbody></table>
      )
    );
  }

  export default AuthorTable;