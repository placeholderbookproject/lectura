import React, {/*useRef,*/ useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import TableRow from './ViewRow.js'
const parse = require('html-react-parser');
//import Collapsible from './Collapsible.js';

const labels = {
    aka : 'aka.',
    born : 'Born',
    died : 'Died',
    nationality : 'Nationality',
    floruit : 'Floruit',
    occupation : 'Occupation',
    other_occupations : 'also known as ',
    wiki : '(wikipedia)',
    influence : 'Influences:',
    influenced : 'Influenced:',
    works : 'List of known works',
    add_works : 'Add works:',
    unspecified : 'not specified',
}

const TextRow = (props) => {
    let publication = props.data.publication
    publication>0?publication = publication + " AD": publication!== ""? publication = Math.abs(publication) + " BC": publication = "not specified"
    return (
        <tr>
            <td>
                <Link to={"/text/"+props.data.index}>{props.data.title + " (" + publication + ")"}</Link>
            </td>
        </tr>
    )
}

const AuthorTable = (props) => {
    //Creates the author "view"
    const tableLabels = labels;
    let texts = props.data.texts;
    if (texts === null) {texts = []};
    const [wiki, setWiki] = useState("");
    const author = props.data;
    const {birth, death, city, country} = author;
    const country_death = "", city_death = ""
    const name = author.name.split(",");
    const numNames = name.length;
    const occupationList = author.position.split(", ");
    const firstOccupation = occupationList[0].split(" ");
    const mainOccupation = occupationList[0];//(firstOccupation.length>1)?firstOccupation.splice(1,firstOccupation.length).join(" "):occupationList[0];
    const nationality = firstOccupation[0];
    useEffect ( () => {
        async function searchWikipedia() {
            const searchQuery = name[0]+ " " + mainOccupation;
            const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
            const response = await fetch(endpoint);
            if (!response.ok) {
              throw Error(response.statusText);
            }
            const json = await response.json();
            const title = json["query"]["search"][0]["title"]//["query"]//["search"][0]
            //const extractText = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exlimit=20&titles=${title}&explaintext=1&exsectionformat=plain`;
            const extractText = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
            const responseTwo = await fetch(extractText)
            if (!responseTwo.ok) {
                throw Error(responseTwo.statusText);
              }
            const result = await responseTwo.json();
            const url = result["content_urls"]["desktop"]["page"]
            console.log(json)
            //console.log(result)
            return setWiki(result["extract"] + " (source: <a href = '" + url + "'>wikipedia</a>)");//return json;
          }
        searchWikipedia();
    },[author.name]
    )
    return (
      (<table id = "authorTableWindow" style = {{width: 500}}>
        <tbody>
        <tr className = "Header"><th>{name[0]}</th></tr>
        <tr>
            <td>{/*string of all other names of the person, should be replaced by hover list or similar*/}
                {numNames>1?
                    /*
                    <Collapsible label = {tableLabels.aka}>
                         {name.slice(1,numNames).map((name) => 
                         <p key = {name} >
                        {name} 
                         </p>
                         )}
                    </Collapsible>*/
                    tableLabels.aka + name.slice(1,numNames).join(", ")
                    :<></>
                }
            </td>
        </tr>
        <TableRow label = {" " + tableLabels.nationality + " "}>{nationality}</TableRow>
        <TableRow label = {tableLabels.born + " "}>
            {birth === ""? tableLabels.unspecified://If no birth -> not specified
                                (birth>0?birth + " AD": Math.abs(birth) + " BC" )//If <0->BC else AD
                }
                {(city === "" && country === "")?"":" ("+city+((city.length>0&&country.length>0)?", ":"")+country + ") " 
                //If neither country or city of birth exists -> empty string
                }
        </TableRow>
        <TableRow label = {tableLabels.died + " "}>
            {death===""? tableLabels.unspecified:
                                (death>0?death + " AD": Math.abs(death) + " BC")}
            {(city_death === "" && country_death === "")?"": " (" + city_death + (country_death.length>0?", ": "") + country_death + ")"}
        </TableRow>
            {(author.birth === ("")|author.death === ("")) && author.floruit !==("")?
                <TableRow label = {tableLabels.floruit + " "}>
                    {" " + author.floruit}
                </TableRow>
            :<></>}
        <TableRow label = {tableLabels.occupation + " "}>
            {mainOccupation}
            {occupationList.length>1?//Drop-down list of occupations if there are more than 1
                /*<Collapsible label = {", " + tableLabels.other_occupations}>
                    <table className = "occupationList">
                        <tbody>
                        {occupationList.slice(1,occupationList.length).map((occupation) =>
                            <tr key = {occupation}>
                                <td>{occupation}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </Collapsible>*/
                ", " + tableLabels.other_occupations + occupationList.slice(1,occupationList.length).join(", ")
                :<></>
            }
        </TableRow>
        <TableRow>
            {typeof wiki !== Object && wiki !== ""? parse(wiki):<></>}
        </TableRow>
        <tr>{/*Placeholder for biography */}</tr>
        <tr>{/*Placeholder for influences */}</tr>
        <tr>{/*Placeholder for influenced */}</tr>
        <tr className = "Works" style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
            <td>{tableLabels.works}</td>
        </tr>
            {(texts.length>0) ? (texts.map((text) => (<TextRow key={text.index} data={text}/>))):<></>}
        </tbody></table>
      )
    );
  }

  export default AuthorTable;