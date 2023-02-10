import {useState, useEffect} from 'react'
const options = {
    import_type_authors : 'Authors',
    import_type_texts : 'Texts',
    import_type_editions : 'Editions',
    import_error : 'Data has not been imported or the data imported is empty',
    import_databtn : 'Imported data',
    latest_editsbtn : 'Latest edits',
    admin_header : 'Admin',
}

const Admin = () => {
    const [importWindow, setImportWindow] = useState(false);
    const [importType, setImportType] = useState("");
    const openImportWindow = () => {
        if (importWindow) {setImportWindow(false)}
        else {setImportWindow(true)}
    }
    return (
        <>
            <header style= {{textDecoration: 'underline 1px rgb(100, 88, 71)', fontSize: 30, fontWeight: 700, paddingBottom: 15}}>
            {options.admin_header}
            </header>
            <div style = {{display:'inline-flex', paddingBottom: 10}}>
                <button onClick = {openImportWindow}>{options.import_databtn}</button>
                <button>{options.latest_editsbtn}</button>
            </div>
            {importWindow?
            <>
                <div style = {{paddingBottom: 10}}>
                    <button onClick = {() => setImportType(options.import_type_authors.toLowerCase())}>{options.import_type_authors}</button>
                    <button onClick = {() => setImportType(options.import_type_texts.toLowerCase())}>{options.import_type_texts}</button>
                    <button onClick = {() => setImportType(options.import_type_editions.toLowerCase())}>{options.import_type_editions}</button>
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

const ImportTable = (props) => {
    const [importData, setImportData] = useState([]);
    const [isImported, setIsImported] = useState(false);
    const [importApproved, setImportApproved] = useState(false);
    const columns = {texts: ['title', 'author', 'publication', 'language','type', 'date_uploaded'],
                    authors: ['name', 'position', 'birth', 'death', 'city', 'country'],
                    editions: ['title', 'author', 'publisher', 'isbn', 'isbn13'],
    }
    const columnsToUse = columns[props.type]
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
    const approveImports = () => {
        fetch('http://127.0.0.1:8000/import/approve?type='+props.type)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response
        })
        setImportApproved(true)
    }
    return (
        <>
        {isImported&&importData.length>0?
        <div>
            <header>All rows of imported data: <button onClick = {approveImports}>Click to approve all imports</button></header>
            <table id = "detailedSearchResults"><tbody>
            <tr>
            <th>#</th>
            {columnsToUse.map((header) => (
                <th key = {header}>{header}</th>
            )
            )}
            </tr>
            {importData.map((row) =>
                (
                <tr key = {importData.indexOf(row)}>
                <td >{importData.indexOf(row)}</td>
                {columnsToUse.map((element) =>
                    (<td key = {importData.indexOf(row)+element}>
                        {row[element]}
                    </td>)
                )}
                </tr>
                )
            )}
            </tbody></table>
        </div>
        :<div>{options.import_error}</div>
        }
        </>
    )
}

export default Admin;