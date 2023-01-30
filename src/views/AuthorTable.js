import React, {useRef} from 'react';
import * as XLSX from 'xlsx';

function readXLSX(file){
    const reader = new FileReader();
    if (reader.readAsBinaryString) {
        reader.onload = (e) => {
            const workbook = XLSX.read(reader.result, {type: 'binary'});
            const firstSheet = workbook.SheetNames[0];
            const excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
            return excelRows;
        };
    }
    reader.readAsBinaryString(file)
}

function AuthorTable (props){
    //Creates the author "view"
    const inputFile = useRef(null);
    const uploadWorks = () => {inputFile.current.click();};
    var uploadedWorkList;
    function onUpload(event) {
        event.stopPropagation();
        event.preventDefault();
        if (inputFile){
            var file = inputFile.current.files[0];
            if (file.name.includes(".xlsx")) {
                uploadedWorkList = readXLSX(file);
            }
        }
    }
    const author = props.data;
    var name = author.name.split(",");
    var numNames = name.length;
    var birth = author.birth, death = author.death, aka = "", floruit = "";
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
        <tr><td>{aka}</td></tr>
        <tr>
          <td><span style={{"fontWeight": '700'}}>born: </span> {birth+" ("+author.city+", "+author.country + ")"}</td>
        </tr>
        <tr>
          <td><span style = {{"fontWeight":'700'}}>died:</span> {death}</td>
        </tr>
        <tr>
            <td>{floruit}</td>
        </tr>
        <tr>
            <td>{""}</td>
        </tr>
        <tr>
            <td>{author.position}</td>
        </tr>
        <tr><td>{"For biographical details, see "}<a href = {"https://www.google.com/search?q="+name[0]}>google</a></td>
          </tr>
        <tr className = {"Works"}>
            <td>{"List of known works  "}
                <input type='file' id='fileElem' ref={inputFile} style={{display: 'none'}} onChange={onUpload}/>
                <button id="fileSelect" onClick={uploadWorks}>Add works</button>
                </td>
        </tr>
        </tbody></table>
      )
    );
  }

  export default AuthorTable;