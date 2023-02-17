const server = 'http://127.0.0.1:8000/'

export const fetchDataEffect = props => () => {
    let searchType = props.type===null?"":"type="+props.type+"&id="
    fetch(server+'data?'+searchType+props.id)
    .then(response => {if(response.ok) {return response.json()}throw response})
    .then(results => {props.setData(results)})
    .finally(() => (props.type===null?props.setLoading(true):void(0)))
}

export const fetchSearchResults = props => () => {
    const searchType = props.type===undefined?"":"&type="+props.type
    const {setSearchResults, query} = props
    if(props.query.length>3) {
          fetch(server+'search?query='+query+searchType)
          .then(response => {
              if (response.ok) {return response.json()} throw response;})
          .then (data => {(searchType!=="")
                            ?setSearchResults(data[props.type])
                            :setSearchResults(data["texts"].concat(data["authors"]))
                        })
        }
    else {void(0)}
}

export const searchWikipediaEffect = props =>  () => {
    const searchWikipedia = async () => {
        const searchQuery = props.name+ " " + props.mainOccupation;
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
        const response = await fetch(endpoint);
        if (!response.ok) {throw Error(response.statusText);}
        const json = await response.json();
        const title = json["query"]["search"][0]["title"]//["query"]//["search"][0]
        //const extractText = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exlimit=20&titles=${title}&explaintext=1&exsectionformat=plain`;
        const extractText = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
        const responseTwo = await fetch(extractText)
        if (!responseTwo.ok) {throw Error(responseTwo.statusText);}
        const result = await responseTwo.json();
        const url = result["content_urls"]["desktop"]["page"]
        console.log(json)
        props.setWiki(result["extract"] + " (source: <a href = '" + url + "'>wikipedia</a>)");//return json;
    }
    !props.edit?searchWikipedia():void(0);
}

export const uploadEdits = (props) => {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(props.editData)
    };
    if (Object.keys(props.editData).length===1){void(0)}
    else {
        fetch(server+'edit?type='+props.type+'&id='+props.id, requestOptions)
        .then(response => response.json())
        .finally(() => props.setEdit(false))
    }
}


export const submitEdits = props => () => {
    const skip = props.type.replace('s','')+"_id";
    const keys = Object.keys(props.editData)
    for (let i = 0; i<keys.length;i++){
        const key = keys[i]
        const toCheck = props.editData[key]
        if (key === skip) {continue}
        if (toCheck === props.data[key]){delete props.editData[key]}
    }
    uploadEdits({type: props.type, id:props.id, editData:props.editData, setEdit:props.setEdit})
}

export const uploadData = (props) => () => {
    const data = props.uploadedList;
    const newKeys = props.selectedOptions;
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
    
    const inputName = (props.inputFile["current"]["value"].split("\\").slice(props.inputFile["current"]["value"].split("\\").length-1)[0].split(".")[0]) + "_" + props.importType
    const date = new Date()
    const curr_date = [date.getFullYear(), date.getMonth()+1, date.getDate()].join("-")
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({data:newData, type:props.importType, name: inputName, date_uploaded: curr_date})
    };
    fetch(server+'import', requestOptions)
        .then(response => response.json())
        .finally(() => props.setShowImports(true))
}

export const approveImports = props => () => {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(props.importData)
    }
    fetch(server+'import/approve?type='+props.type, requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw response
    })
    props.setImportApproved(true)
}
