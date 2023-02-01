import React, {useRef, useState} from 'react';
import * as XLSX from 'xlsx';
import {Link} from 'react-router-dom';

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
    var birth = author.birth, death = author.death, aka = "", floruit = "", name = author.name.split(",");
    var city = author.city, country = author.country;
    var numNames = name.length;
    if ((author.birth === ("unknown")|author.death === ("unknown")) && author.floruit !==("unknown")) 
        {floruit = "floruit: " + author.floruit}
    if (death<0) {death = Math.abs(death)+" BC";}
    else{death = death+ " AD";}
    if (birth<0){birth = Math.abs(birth) + " BC";}
    else {birth = birth + " AD";}
    if (numNames > 1){aka = "aka. "+name.slice(1,numNames).join(", ")}
    return (
      (<table id = "authorTableWindow"><tbody>
        <tr className = "Header"><td>{name[0]}</td></tr>
        <tr>
            <td>{/*string of all other names of the person, should be replaced by hover list or similar*/}
                {aka}
            </td>
        </tr>
        <tr>
            <td>{/*Birth date of the person including place of birth. Should include source etc later*/}
                <span style={{"fontWeight": '700'}}>born: </span>{birth+" ("+city+", "+country + ")"}
            </td>
        </tr>
        <tr>
            <td>{/*Death date of person. Should include place of death later*/}
                <span style = {{"fontWeight":'700'}}>died:</span>{death}
            </td>
        </tr>
        <tr>
            <td>{/*Floruit, only if birth or death does not exist and floruit itself exists*/}
                {floruit}
            </td>
        </tr>
        <tr>
            <td>{/*Positions/roles of the person - should be formatted and fixed later*/}
                {author.position}
            </td>
        </tr>
        <tr>
            <td>{/*Replace this with some sort of import from source, f.ex. wikipedia, later*/}
                {"For biographical details, see "}<a href = {"https://www.google.com/search?q="+name[0]}>google</a>
            </td>
        </tr>
        <tr className = {"Works"}>
            <td>{"List of known works  "}
                <input type='file' id='fileElem' ref={inputFile} style={{display: 'none'}} onChange={onUpload}/>
                <button id="fileSelect" onClick={uploadWorks}>Add works</button>
            </td>
        </tr>
            {(works.length>0) ? (works.map((work) => (<WorkRow key={work.index} data={work}/>))):<></>}
        </tbody></table>
      )
    );
  }

  export default AuthorTable;