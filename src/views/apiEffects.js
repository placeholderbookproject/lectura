import { authorQuery, authorTextQuery, textQuery, externalsQuery } from "./wikidata";
const server = 'http://127.0.0.1:8000/'

const fetchFunc = (query, setData, signal) => {
    fetch(query, {signal}).then(response => {if(response.ok) {return response.json()}throw response}).then(results => {setData(results)})
    .catch((error) => {if(error.name!=='AbortError'){console.log("Error:", error);}});
}

export const createNewList = (list_info) => {
    const requestBody = {user_id: list_info.user_id, list_name:list_info.list_title
            , list_type:list_info.list_type,list_description:list_info.list_description};
    return fetch(server+'create_list',{method: 'POST',body: JSON.stringify(requestBody)})
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error))
}

export const fetchUserList = (list_id, setData, type) => {
    const query = `${server}get_user_list?list_id=${list_id}&type=${type}`;
    return fetchFunc(query, setData)
}

export const fetchAllLists = (setData) => {fetchFunc(`${server}get_all_lists`,setData);}

export const fetchDataEffect = props => () => {
    const {type, id, setData, by} = props
    const search = type===null||type===undefined?"":"type="+type+"&id="+id+(by!==null?"&by="+by:"")
    fetchFunc(server+'data?'+search, setData)
}

export const fetchList = props => () => {
    const {setData, filters, type} = props
    const query = `lists?language=${filters.language}&country=${filters.country}&query_type=${type}`
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
    const lastName = name.split(/[, ]+/).pop();
    const search = `(title:"${title}" OR title:"${originalTitle}") AND (text:"${name}" OR text:"${lastName}")`;
    const params = {q: search, output: 'json', fields: 'identifier,creator,title,language,year',
      sort: ['downloads desc','year asc', 'addeddate asc'],rows: 20};
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    // send the GET request to the search API endpoint
    fetch(`${searchUrl}?${queryString}`)
      .then(response => response.json())
      .then(data => {setArchive(data.response.docs);})
      .catch(error => console.error(error));    
}

export const createNewUser = (input) => {
    console.log(input.user_password)
    const requestBody = {user_name: input.user_name, user_email:input.user_email, user_password:input.user_password};
    return fetch(server+'create_user',{method: 'POST',body: JSON.stringify(requestBody)})
    .then(response => response.json())
    .then (data => data)
    .catch(error => console.log(error))
}

export const loginUser = (input) => {
    return fetch(server+'login_user?'+'user='+input.user)
        .then(response => response.json())
        .catch(error => console.log(error))
}