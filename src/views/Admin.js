import {useState, useEffect} from 'react';
import labels from './labels.js';
import options from './filters.js';
import {approveImports} from './apiEffects.js';

const Admin = () => {
    const [importWindow, setImportWindow] = useState(false);
    const [importType, setImportType] = useState("");
    const openImportWindow = () => {importWindow?setImportWindow(false):setImportWindow(true)}
    return (
        <>
            <header style= {{textDecoration: 'underline 1px rgb(100, 88, 71)', fontSize: 30, fontWeight: 700, paddingBottom: 15}}>
            {labels.admin_header}
            </header>
            <div style = {{display:'inline-flex', paddingBottom: 10}}>
                <button onClick = {openImportWindow}>{labels.import_databtn}</button>
                <button>{labels.latest_editsbtn}</button>
            </div>
            {importWindow?
            <>
                <div style = {{paddingBottom: 10}}>
                    <button onClick = {() => setImportType(labels.import_type_authors.toLowerCase())}>{labels.import_type_authors}</button>
                    <button onClick = {() => setImportType(labels.import_type_texts.toLowerCase())}>{labels.import_type_texts}</button>
                    <button onClick = {() => setImportType(labels.import_type_editions.toLowerCase())}>{labels.import_type_editions}</button>
                </div>
            {importType !== ""?    
            <ImportTable type = {importType}/>
            :<></>}
            </>
            :<></>
        }
        </>
    )
}

export const ImportTable = (props) => {
    const [importData, setImportData] = useState([]);
    const [isImported, setIsImported] = useState(false);
    const [importApproved, setImportApproved] = useState(false);
    const columnsToUse = options[props.type]
    useEffect (() => {
        const fetchData = () => {
            const requestOptions = {
            method: 'GET',
                        };
            fetch('http://127.0.0.1:8000/import_data?type='+props.type, requestOptions)
            .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
            })
            .then (data => {setImportData(data)})
            .finally( () => setIsImported(true))
        }
        fetchData()
    },[props.type, importApproved]
    )
    const removeImportRow = (id) => {
        const oldData = importData
        let newData = []
        for (let i = 0;i<importData.length;i++){
            if (i !== id) {newData.push(oldData[i])}
        }
        setImportData(newData);
    }
    return (
        <>
        {isImported&&importData.length>0?
        <div>
            <header>{labels.admin_import_header}
                <button onClick = {approveImports({importData, setImportApproved, type: props.type})}>{labels.admin_approve_imports}</button>
                </header>
            <table id = "detailedSearchResults"><tbody>
            <tr>
                <th style = {{backgroundColor: 'white', border: 'none'}}></th>
                <th>#</th>
                {columnsToUse.map((header) => (<th key = {header.label}>{header.label}</th>))}
            </tr>
            {importData.map((row) =>
                (<tr key = {importData.indexOf(row)}>
                <td onClick = {() => removeImportRow(importData.indexOf(row))}>X</td>
                <td >{importData.indexOf(row)}</td>
                {columnsToUse.map((element) =>
                    (<td key = {importData.indexOf(row)+element['value']}>
                        {row[element['value']]}
                    </td>)
                )}
                </tr>)
            )}
            </tbody></table>
        </div>
        :<div>{labels.import_error}</div>
        }
        </>
    )
}

export default Admin;