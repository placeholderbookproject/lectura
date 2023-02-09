import * as XLSX from 'xlsx';
import React, {useRef, useState, useEffect} from 'react';
import Select from 'react-select';
//const fileSaver = require('file-saver'); 

const textFilters = [
    //{value: '#', label: "#"},
    {value: 'title', label: 'Title'},
    {value: 'author', label: 'Author'},
    {value: 'publication',label: 'Publication Year'},
    {value: 'language', label: 'Language'},
    {value: 'type', label: 'Type'},
    {value: 'genre', label: 'Genre'},
]

const authorFilters = [
    //{value: '#', label: "#"},
    {value: 'name', label: 'Author'},
    {value: 'position', label: 'Positions'},
    {value: 'birth',label: 'Birth Year'},
    {value: 'death',label: 'Death Year'},
    {value: 'floruit', label: 'Floruit'},
    {value: 'country',label: 'Country of Birth'},
    {value: 'city', label:'City of Birth'},
    //{value: 'works', label: 'Works'},
]

const options = 
    {"authors":authorFilters,
    "texts":textFilters,}

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
    import_preview_label : 'Please change column names using the dropdowns',
    import_push_data : 'Push data to database',
    import_refresh : 'Refresh',
}

const ImportWindow = () => {
    const importLabels = labels;
    const [importType,setImportType] = useState("");
    const inputFile = useRef(null);
    let [uploadedList, setUploadedList] = useState([]);
    const headerOptions = options;
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [headers, setHeaders] = useState([]);
    const changeHandler = (event) => {onUpload(event)}
    const onUpload = (event) => {
        /*Add some sort of export function to server/local -> validation&approval -> add to main dataframe*/
        event.stopPropagation();
        event.preventDefault();
        if (inputFile){
            var file = inputFile.current.files[0];
            if (file.name.includes(".xlsx")|file.name.includes("xlsb")) {
                const reader = new FileReader();
                if (reader.readAsBinaryString) {
                    reader.onload = (event) => {
                        const workbook = XLSX.read(event.target.result,{type:'binary'});//(reader.result, {type: 'binary'});
                        const firstSheet = workbook.SheetNames[0];
                        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
                        setUploadedList(excelRows);
                        setHeaders(Object.keys(excelRows[0]));
                    };
                }
                reader.readAsBinaryString(file)
            }
        }
    }

    const selectHeader = (e, header) => {
        const oldOptions = selectedOptions;
        const newHeader = e.value;
        for (let i = 0; i<oldOptions.length;i++) {
            const option = oldOptions[i];
            if(header === option["oldHeader"]) {
                oldOptions[i] = {oldHeader:header, newHeader:newHeader}
                setSelectedOptions(oldOptions)
                return
            }
        }
        oldOptions.push({oldHeader:header, newHeader:newHeader});
        setSelectedOptions(oldOptions);
    }    
    const selectImportType = (e) => {setImportType(e.value)}
    const removeColumn = (header) => {
        const oldHeaders = headers;
        const oldOptions = selectedOptions;
        let newHeaders = [];
        let newOptions = [];
        for (let i = 0; i<oldHeaders.length;i++){
            const oldHeader = oldHeaders[i]
            if(oldHeader !== header) {newHeaders.push(oldHeader)}
        }
        for (let j=0;j<oldOptions.length;j++) {
            const oldOption = oldOptions[j]
            if (oldOption !== undefined) {
                if(oldOption["oldHeader"] === header) {continue}
                else {newOptions.push(oldOption)}
            }
        }
        setHeaders(newHeaders);
        setSelectedOptions(newOptions);
    }
    const uploadData = () => {
        const data = uploadedList;
        const newKeys = selectedOptions;
        let newData = []
        for (let i = 0; i<data.length;i++){
            const dataElement = data[i];
            const dataElementKeys = Object.keys(dataElement);
            let newDataElement = {}
            for (let j = 0; j<newKeys.length;j++) {
                const header = newKeys[j]
                if (dataElementKeys.includes(header["oldHeader"])) {
                    newDataElement[header["newHeader"]] = dataElement[header["oldHeader"]]
                }
            }
            newData.push(newDataElement)
        }
        
        const inputName = (inputFile["current"]["value"].split("\\").slice(inputFile["current"]["value"].split("\\").length-1)[0].split(".")[0]) + "_" + importType
        const date = new Date()
        const curr_date = [date.getFullYear(), date.getMonth()+1, date.getDate()].join("-")
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({data:newData, type:importType, name: inputName, date_uploaded: curr_date})
        };
        fetch('http://127.0.0.1:8000/import', requestOptions)
            .then(response => response.json())
            //.then(data => console.log(data))
        //const blob = new Blob ([JSON.stringify(newData)],{type: "application/json"});
        //const fileName = inputFile.current.value.split("\\")[inputFile.current.value.split("\\").length-1].split(".")[0]
        //fileSaver.saveAs(blob, "./data/"+fileName + ".json")
    }
    const refreshImport = () => {
        setHeaders(Object.keys(uploadedList[0]))
    }
    return (
        <>
            <header style = {{fontSize:30, fontWeight:700, textDecoration: 'underline 1px rgb(100, 88, 71)', paddingBottom: 10}}>
                {importLabels.import_header}
            </header>
            <div style = {{paddingTop:10}}>
                <input type='file' id='fileElem' ref={inputFile} onChange={changeHandler}/>
            </div>
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
            {uploadedList.length>0?//If uploaded data is longer than zero (i.e. it has been uploaded correctly) -> make preview
                <>
                <header style = {{fontSize:30, fontWeight:700, textDecoration: 'underline 1px rgb(100, 88, 71)', paddingBottom: 10}}>
                {importLabels.import_preview_header}
                </header>
                <label>{importLabels.import_preview_label + " "}<button onClick = {refreshImport}>{importLabels.import_refresh}</button></label>
                <table id = "importPreview">
                    <tbody>
                        <tr>
                            {headers.map((header) =>
                                <th key = {header}>
                                    <div>
                                    {header}
                                        <div style = {{display:'inline-flex'}}>
                                        <Select placeholder={header} 
                                            options = {headerOptions[importType]}
                                            onChange={(e) => selectHeader(e,header)}
                                        />
                                        <button type="button" className="btn-close" aria-label="Close" style = {{backgroundColor:'#bebebe', border: '1px solid',}}
                                            onClick = {() => removeColumn(header)}>
                                            X
                                        </button>
                                        </div>
                                    </div>
                                </th>
                            )
                            }
                        </tr>
                        {headers.length>0?
                            uploadedList.slice(0,uploadedList.length>3?3:uploadedList.length).map((row) => 
                                <tr key = {row[headers[0]]}>
                                    {headers.map((row_value) =>
                                        <td key = {row_value+row[row_value]}>{row[row_value]}</td>
                                    )}
                                </tr>)
                        :<></>}
                    </tbody>
                </table></>
                :<></>
            }
            {/*<button id="fileSelect" onClick={uploadWorks}>Add works</button>   */}
            {//selectedOptions.length===headers.length && selectedOptions.length !== 0?
                <div style = {{paddingTop:10}}>
                    <button onClick = {uploadData}>{importLabels.import_push_data}</button>
                </div>
                //:<></>
                }
        </>
    )
}

export default ImportWindow;