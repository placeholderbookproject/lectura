import React, {/*useRef,*/ useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
const parse = require('html-react-parser');
//import Collapsible from 'react-collapsible';

const labels = {
    aka : 'aka.',
    born : 'Born:',
    died : 'Died:',
    nationality : 'Nationality:',
    floruit : 'Floruit:',
    occupation : 'Occupation:',
    other_occupations : 'also known as a..',
    wiki : '(wikipedia)',
    influence : 'Influences:',
    influenced : 'Influenced:',
    works : 'List of known works',
    add_works : 'Add works:',
    unspecified : 'not specified',
}

const Collapsible = (props) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {setOPen(!open);}
    return (
      <>
        <span onClick = {toggle} className = "collapsibleBtn">{props.label}</span>
        {open &&
            <div className={open ? "content-show" : "content-parent"}>
                <div className="toggle">{props.children}</div>
            </div>
        }
      </>
    );
  };

const WorkRow = (props) => {
    return (
        <tr>
            <td>
                <Link to={"/work/"+props.data.index}>{props.data.title + " (" + props.data.publication + ")"}</Link>
            </td>
        </tr>
    )
}

const AuthorTable = (props) => {
    //Creates the author "view"
    const tableLabels = labels;
    let works = props.data.works;
    if (works === null) {works = []};
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
            const searchQuery = name[0];
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
            console.log(result)
            return setWiki(result["extract"] + " (source: "+ "<a href = '" + url + "'>wikipedia</a>)");//return json;
          }
        searchWikipedia();
    },[wiki, props, name]
    )
    return (
      (<table id = "authorTableWindow">
        <tbody>
        <tr className = "Header"><th>{name[0]}</th></tr>
        <tr>
            <td>{/*string of all other names of the person, should be replaced by hover list or similar*/}
                {numNames>1?
                    <Collapsible label = {tableLabels.aka}>
                         {name.slice(1,numNames).map((name) => 
                         <p key = {name}>
                        {name} 
                         </p>
                         )}
                    </Collapsible>
                    :<></>
                }
            </td>
        </tr>
        <tr>
            <td>{/*Birth date of the person including place of birth. Should include source etc later*/}
                <span style={{"fontWeight": '700'}}>{tableLabels.born} </span>
                {birth === ""? tableLabels.unspecified://If no birth -> not specified
                                (birth>0?birth + " AD": Math.abs(birth) + " BC" )//If <0->BC else AD
                }
                {(city === "" && country === "")?"":" ("+city+((city.length>0&&country.length>0)?", ":"")+country + ")" 
                //If neither country or city of birth exists -> empty string
                }
            </td>
            <td>{/*Nationality */}
                <span style ={{"fontWeight":'700'}}>{tableLabels.nationality + " "}</span>
                {nationality}
            </td>
        </tr>
        <tr>
            <td>{/*Death date of person. Should include place of death later*/}
                <span style = {{"fontWeight":'700'}}>{tableLabels.died} </span>
                    {death===""? tableLabels.unspecified:
                                (death>0?death + " AD": Math.abs(death) + " BC")
                    }
                    {(city_death === "" && country_death === "")?"": " (" + city_death + (country_death.length>0?", ": "") + country_death + ")"}
            </td>
        </tr>
        <tr>{/*Floruit, only if birth or death does not exist and floruit itself exists*/}
                {(author.birth === ("")|author.death === ("")) && author.floruit !==("")?
                <td>
                <span style = {{"fontWeight":'700'}}>
                {tableLabels.floruit}
                </span>
                {" " + author.floruit}
                </td>
                :<></>
                }

        </tr>
        <tr>
            <td>{/*Positions/roles of the person - should be formatted and fixed later*/}
                <span style = {{"fontWeight":"700"}}>
                    {tableLabels.occupation + " "}
                </span>
                {mainOccupation}
            </td>
                {occupationList.length>1?
                    <td>
                    <Collapsible label = {tableLabels.other_occupations}>
                        <table className = "occupationList">
                            <tbody>
                            {occupationList.slice(1,occupationList.length).map((occupation) =>
                                <tr key = {occupation}>
                                    <td>{occupation}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </Collapsible>
                    </td>
                    :<></>
                }
        </tr>
        <tr>
            <td>{/*Replace this with some sort of import from source, f.ex. wikipedia, later*/}
                {typeof wiki !== Object && wiki !== ""? parse(wiki):<></>}
            </td>   
        </tr>
        {/*<tr>
            <td>
                {"For more biographical details, see "}<a href = {"https://www.google.com/search?q="+name[0]}>google</a>
            </td>
        </tr>
        */}  
        <tr>{/*Placeholder for biography */}
        </tr>
        <tr>{/*Placeholder for influences */}
        </tr>
        <tr>{/*Placeholder for influenced */}
        </tr>
        <tr className = "Works" style = {{textDecoration: 'underline 1px rgb(100, 88, 71)'}}>
            <td>{"List of known works  "}
            </td>
        </tr>
            {(works.length>0) ? (works.map((work) => (<WorkRow key={work.index} data={work}/>))):<></>}
        </tbody></table>
      )
    );
  }

  export default AuthorTable;