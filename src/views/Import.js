import * as XLSX from 'xlsx';
import React, {useRef, useState/*, useEffect*/, ChangeEvent} from 'react';
import Select from 'react-select';


const importTypes = [
    {value: 'authors', label:'Authors'},
    {value: 'texts', label:'Texts'},
    {value: 'editions', label: 'Editions'},
]

const labels = {
    import_header : 'Data Import',
    import_type : 'Please select import type',
    import_type_select : 'Import type',
    import_preview_header : 'Preview',
    import_upload_data : 'Upload data',
}

const ImportWindow = (props) => {
    const importLabels = labels;
    const [importType,setImportType] = useState("");
    const uploadWorks = () => {inputFile.current.click();};
    const inputFile = useRef(null);
    let [uploadedList, setUploadedList] = useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    }
    const onUpload = (event) => {
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
                        setUploadedList(excelRows);
                    };
                }
                reader.readAsBinaryString(file)
            }
        }
        console.log(uploadedList);
    }
/*
    const handleUploadClick = () => {
        if (!isSelected) {
          return;
        }
    
        // 👇 Uploading the file using the fetch API to the server
        fetch('https://httpbin.org/post', {
          method: 'POST',
          body: selectedFile,
          // 👇 Set headers manually for single file upload
          headers: {
            'content-type': selectedFile.type,
            'content-length': `${selectedFile.size}`, // 👈 Headers need to be a string
          },
        })
          .then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.error(err));
      };*/
    
    const selectImportType = (e) => {setImportType(e.value)}
    return (
        <>
            <header style = {{fontSize:30, fontWeight:700, textDecoration: 'underline 1px rgb(100, 88, 71)', paddingBottom: 10}}>
                {importLabels.import_header}
            </header>
            <label>{importLabels.import_type + " "}</label>
            <div style = {{display:'inline-flex'}}>
                <Select style = {{
                            container: base => ({
                                ...base,
                                flex: 1
                            })}
                            }
                    placeholder={importLabels.import_type_select}
                    options = {importTypes}
                    onChange = {selectImportType}
                />
            </div>
            {importType !== ""?
                <div style = {{paddingTop:10}}>
                    <input type='file' id='fileElem' ref={inputFile} onChange={changeHandler}/>
                </div>
            :<></>}
            {isSelected?
                <div style = {{paddingTop:10}}>
                    <button onClick = {onUpload}>{importLabels.import_upload_data}</button>
                </div>
                :<></>}
            {uploadedList.length>0?
                <>
                <header style = {{fontSize:30, fontWeight:700, textDecoration: 'underline 1px rgb(100, 88, 71)', paddingBottom: 10}}>
                {importLabels.import_preview_header}
                </header>
                <table id = "importPreview">
                    <tbody>
                        <tr>
                            {Object.keys(uploadedList[0]).map((header) =>
                                <th key = {header}>{header}</th>
                            )
                            }
                        </tr>
                        {uploadedList.slice(0,uploadedList.length>5?5:uploadedList.length).map((row) => 
                            <tr>
                                {Object.keys(row).map((row_value) =>
                                    <td>{row[row_value]}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table></>
                :<></>
            }
            {/*<button id="fileSelect" onClick={uploadWorks}>Add works</button>   */}
        </>
    )
}



export default ImportWindow;