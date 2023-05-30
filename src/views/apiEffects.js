import { authorQuery, authorTextQuery, textQuery, externalsQuery } from "./wikidata";
const server = 'http://127.0.0.1:8000/'

const fetchFunc = (query, setData, signal) => {
    console.log(query)
    fetch(query, {signal}).then(response => {if(response.ok) {return response.json()}throw response}).then(results => {setData(results)})
    .catch((error) => {if(error.name!=='AbortError'){console.log("Error:", error);}});
}

export const fetchDataEffect = props => () => {
    const {type, id, setData, by} = props
    const search = type===null||type===undefined?"":"type="+type+"&id="+id+(by!==null?"&by="+by:"")
    fetchFunc(server+'data?'+search, setData)
}

export const fetchList = props => () => {
    const {setData, filters} = props
    const query = `lists?language=${filters.language}&country=${filters.country}`
    fetchFunc(server+query, setData)
}

export const fetchComments = props => () => {
    const {setComments} = props;
    fetchFunc(server+'extract_comments', setComments)
}

export const fetchSearchResults = props => () => {
    const {setSearchResults, query, type, filters, signal} = props
    const searchType = type===undefined||type===null?"":"&searchtype="+type
    if(query!==undefined && query.length>3) {
        fetchFunc(server+'search?query='+query+searchType+"&filters="+JSON.stringify(filters), setSearchResults, signal)}
}

export const wikidataEffect = props => () => {
    const {type, q_number, setWikidata, language} = props
    const headers = { Accept: "application/sparql-results+json" };
    const lang = language?`"${language}"`:'"en"'
    let query;
    if (type==="author") {
            query = authorQuery.replaceAll('"en"', lang)
            if (language==="en"){query = query.replace("[nativeHeader]","")}
            else{query=query.replace("[nativeHeader]",'OPTIONAL {?author rdfs:label ?authorLabel. FILTER(LANG(?authorLabel)!="en"&&LANG(?authorLabel) = "en_fixed").}')}
        }
    else if (type==="author_texts") {query = authorTextQuery.replaceAll('"en"',lang)}
    else if (type==="texts") {
        query = textQuery.replaceAll('"en"',lang)
        if (language==="en"){query = query.replace("[nativeHeader]","")}
        else{query=query.replace("[nativeHeader]",`OPTIONAL {?book rdfs:label ?bookLabel. FILTER(LANG(?bookLabel)!=${lang}&&LANG(?bookLabel) = "en_fixed").}`)}
    }
    else if (type==="externals"){query = externalsQuery.replaceAll('"en"',lang)};
    query = query.replace("wd:q_number","wd:"+q_number).replace("[q2]",q_number).replace("en_fixed", "en");
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
    fetch(url, {headers})
    .then(response => {if (response.ok) {return response.json()} throw response;})
    .then (data => {setWikidata(data)})       
}

export const archiveEffect = props => () => {
    const {title, name, setArchive, originalTitle} = props
    const searchUrl = 'https://archive.org/advancedsearch.php';
    const lastName = name.split(/[, ]+/).pop()
    const search = `(title:"${title}" OR title:"${originalTitle}") AND (text:"${name}" OR text:"${lastName}")`;
    const params = {
      q: search,
      output: 'json',
      fields: 'identifier,creator,title,language,year',
      sort: ['downloads desc','year asc', 'addeddate asc'], // sort by year and then by date added
      rows: 20 // set the number of results to return
    };
    // encode the search query parameters as a URL query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    // send the GET request to the search API endpoint
    fetch(`${searchUrl}?${queryString}`)
      .then(response => response.json())
      .then(data => {setArchive(data.response.docs);})
      .catch(error => console.error(error));    
}

export const uploadEdits = (props) => {
    const {editData, id, type, setEditUploaded} = props
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(editData)
    };
    if (Object.keys(editData).length===1){void(0)}
    else {
        fetch(server+'edit?type='+type+'&id='+id, requestOptions)
        .then(response => response.json())
        .finally(() => setEditUploaded(true))
    }
}

export const submitEdits = props => () => {
    const {type, id, editData, setEditUploaded, data} = props
    const skip = type.replace('s','')+"_id";
    const keys = Object.keys(editData)
    for (let i = 0; i<keys.length;i++){
        const key = keys[i]
        const toCheck = editData[key]
        if (key === skip) {continue}
        if (toCheck === data[key]){delete editData[key]}
    }
    uploadEdits({type, id, editData, setEditUploaded})
}

export const uploadNew = (props) => () => {
    const {data, type, setSubmissionUploaded} = props
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    fetch(server+'new?type='+type, requestOptions)
        .then(response => response.json())
        .finally(() => {setSubmissionUploaded(true)}                
        )
}

export const uploadData = (props) => () => {
    const {inputFile, importType, setShowImports, uploadedList, selectedOptions} = props
    let newData = []
    for (let i = 0; i<uploadedList.length;i++){
        const dataElement = uploadedList[i];
        const dataElementKeys = Object.keys(dataElement);
        let newDataElement = {}
        for (let j = 0; j<selectedOptions.length;j++) {
            const header = selectedOptions[j]
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
    fetch(server+'import', requestOptions)
        .then(response => response.json())
        .finally(() => setShowImports(true))
}

export const approveImports = props => () => {
    const {importData, type, setImportApproved} = props
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(importData)
    }
    fetch(server+'import/approve?type='+type, requestOptions)
    .then(response => {if (response.ok) {return response.json()} throw response})
    setImportApproved(true)
}

export const verifyLogin = (pw, email) => {
    const requestBody = {
        email: email,
        password: pw
      };
    fetch(server+'login',{
        method: 'POST',
        body: JSON.stringify(requestBody)
    })
    .then(response => console.log(response))
    .catch(error => console.log(error))
}

export const createUser = props => (pw, email) => {
    console.log(props.setResponse)
    const requestBody = {
        email: email,
        password: pw
      };
    fetch(server+'create_user',{
        method: 'POST',
        body: JSON.stringify(requestBody)
    })
    .then(response => props.setResponse(response))
    .catch(error => console.log(error))
}