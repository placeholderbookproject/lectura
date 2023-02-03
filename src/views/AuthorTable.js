import React, {useRef, useState} from 'react';
import * as XLSX from 'xlsx';
import {Link} from 'react-router-dom';
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
    const data = props.data;
    return (
      <>
        <span onClick = {toggle} className = "collapsibleBtn">{props.label}</span>
        {open &&
            <div className={open ? "content-show" : "content-parent"}>
                <div className="toggle">{props.children}</div>
            </div>
        
        /*?
            data.map((dataElement) => 
                <p key = {dataElement}>
                    {dataElement}
                </p>
            ):<></>*/
        }
      </>
    );
  };


function WorkRow(props) {
    return (
        <tr>
            <td>
                <Link to={"/work/"+props.data.index}>{props.data.title + " (" + props.data.publication + ")"}</Link>
            </td>
        </tr>
    )
}

function AuthorTable (props){
    //Creates the author "view"
    const tableLabels = labels;
    const inputFile = useRef(null);
    const uploadWorks = () => {inputFile.current.click();};
    var works = props.data.works;
    if (works === null) {works = []};
    let [uploadedWorkList, setUploadedWorkList] = useState([]);
    function onUpload(event) {
        /*Add some sort of export function to server/local -> validation&approval -> add to main dataframe*/
        event.stopPropagation();
        event.preventDefault();
        if (inputFile){
            var file = inputFile.current.files[0];
            if (file.name.includes(".xlsx")) {
                const reader = new FileReader();
                if (reader.readAsBinaryString) {
                    reader.onload = (event) => {
                        const workbook = XLSX.read(event.target.result,{type:'binary'});//(reader.result, {type: 'binary'});
                        const firstSheet = workbook.SheetNames[0];
                        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
                        setUploadedWorkList(excelRows);
                    };
                }
                reader.readAsBinaryString(file)
            }
        }
    }
    const author = props.data;
    var birth = author.birth, death = author.death, name = author.name.split(",");
    var city = author.city, country = author.country, country_death = "", city_death = "";
    var numNames = name.length;
    var occupationList = author.position.split(", ");
    var firstOccupation = occupationList[0].split(" ");
    const mainOccupation = occupationList[0];//(firstOccupation.length>1)?firstOccupation.splice(1,firstOccupation.length).join(" "):occupationList[0];
    const nationality = firstOccupation[0];
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
                {(city === "" && country === "")?"":" ("+city+((city.length>0&&country.length>0)?", ":"")+country + ")" //If neither country or city of birth exists -> empty string
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
                {"For biographical details, see "}<a href = {"https://www.google.com/search?q="+name[0]}>google</a>
            </td>
        </tr>
        <tr>{/*Placeholder for biography */}
        </tr>
        <tr>{/*Placeholder for influences */}
        </tr>
        <tr>{/*Placeholder for influenced */}
        </tr>
        <tr className = {"Works"}>
            <td>{"List of known works  "}
                {/*<input type='file' id='fileElem' ref={inputFile} style={{display: 'none'}} onChange={onUpload}/>
                <button id="fileSelect" onClick={uploadWorks}>Add works</button>*/}
            </td>
        </tr>
            {(works.length>0) ? (works.map((work) => (<WorkRow key={work.index} data={work}/>))):<></>}
        </tbody></table>
      )
    );
  }

  export default AuthorTable;