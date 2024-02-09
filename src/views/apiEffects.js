import { authorQuery, authorTextQuery, textQuery, externalsQuery } from "./wikidata";
import { reformatWikidata, reformatWikitexts } from "./formattingFuncs";
const server = 'http://127.0.0.1:8000/'
const googleAPIKey = 'AIzaSyBpljudDJKdDAMHnvh50xCTx8YdSWe3_BM'

const fetchFunc = (query, setData, signal) => {
    return fetch(query, {signal}).then(response => {if(response.ok) {return response.json()}throw response}).then(results => {setData(results); return results})
    .catch((error) => {if(error.name!=='AbortError'){console.log("Error:", error);}});
}

export const postFetch = (body, url) => {
    return fetch(server+url,{method: 'POST',body: JSON.stringify(body)}).then(response => response.json()).then(data => data)
            .catch(error => console.log(error))
}

export const postDeleteData = (data) => postFetch(data, 'delete_data')

export const postComment = (data) => postFetch(data, 'upload_comment')
export const postUpdateComment = (data) => postFetch(data, 'update_comment')
export const getComments = (comment_type, comment_type_id, user_id, setData) =>
    fetchFunc(`${server}extract_comments?comment_type=${comment_type}&comment_type_id=${comment_type_id}${user_id?"&user_id="+user_id:""}`, setData)
export const postCommentInteraction = (data) => postFetch(data,'comment_interaction')

export const postTextInteraction = data => postFetch(data,'element_interaction');

export const createNewList = (list_info) => postFetch(list_info, 'create_list')
export const updateUserList = (input) => postFetch(input, 'update_user_list')
export const updateListInteraction = (input) => postFetch(input, 'user_list_interaction')

export const fetchUserList = (list_id, user_id, hash,setData) => fetchFunc(`${server}get_user_list?list_id=${list_id}${user_id?"&user_id="+user_id+"&hash="+hash:""}`, setData)
export const fetchAllLists = (user_id=null,setData) => {fetchFunc(`${server}get_all_lists${user_id?'?user_id='+user_id:""}`,setData);}
export const fetchListReferences = (type, id, setData) => {fetchFunc(`${server}user_list_references?type=${type}&id=${id}`, setData)}

export const fetchDataEffect = props => () => {
    const {type, id, setData, by, user_id} = props
    const search = type===null||type===undefined?"":"type="+type+"&id="+id+(by!==null?"&by="+by:"")+(user_id?"&user_id="+user_id:"")
    return fetchFunc(server+'data?'+search, setData)
}

export const fetchUserData = (user_id, setData) => {fetchFunc(`${server}user_data?user_id=${user_id}`,setData)}
export const updateUserData = data => postFetch(data, 'update_user_data');

export const fetchList = props => () => {
    const {setData, filters, type} = props
    const query = `official_lists?language=${filters.language}&country=${filters.country}&query_type=${type}`
    fetchFunc(server+query, setData)
}

export const fetchSearchResults = props => () => {
    const {setSearchResults, query, type, filters, signal} = props
    const searchType = type===undefined||type===null?"":"&searchtype="+type
    if(query!==undefined && query.trim().length>3) {
        fetchFunc(server+'search?query='+query+searchType+"&filters="+JSON.stringify(filters), setSearchResults, signal)}
}

export const createNewUser = (input) => postFetch(input, 'create_user')
export const deleteUser = (input) => postFetch(input, 'delete_user')
export const loginUser = (input) => fetch(server+'login_user?user='+input.user).then(response => response.json()).catch(error => console.log(error))

export const getAdminData = (user_id,hash,type, setData) => fetchFunc(`${server}admin_data?user_id=${user_id}&hash=${hash}&data_type=${type}`, setData)
export const postRoleChange = (input) => postFetch(input, 'update_user_role')

export const wikidataEffect = props => () => {
    const {type, q_number, setWikidata, language} = props
    const headers = { Accept: "application/sparql-results+json" };
    const lang = language?`${language}`:'[en]'
    let query;
    if (type==="author") {
            query = authorQuery.replaceAll('[en]', lang)
            if (language==="en"){query = query.replace("[nativeHeader]","")}
            else{query=query.replace("[nativeHeader]",'OPTIONAL {?author rdfs:label ?authorLabel. FILTER(LANG(?authorLabel)!="en"&&LANG(?authorLabel) = "en_fixed").}')}
        }
    else if (type==="author_texts") {query = authorTextQuery.replaceAll('[en]',lang)}
    else if (type==="texts") {
        query = textQuery.replaceAll('[en]',lang)
        if (language==="en"){query = query.replace("[nativeHeader]","")}
        else{query=query.replace("[nativeHeader]",`OPTIONAL {?book rdfs:label ?bookLabel. FILTER(LANG(?bookLabel)!="${lang}"&&LANG(?bookLabel) = "en_fixed").}`)}
    }
    else if (type==="externals"){query = externalsQuery.replaceAll('[en]',lang)};
    query = query.replace("wd:q_number","wd:"+q_number).replace("[q2]",q_number).replace("en_fixed", "en");
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
    return fetch(url, {headers})
    .then(response => {if (response.ok) {return response.json()} throw response;})
    .then (data => {if(type==="author_texts"){setWikidata(reformatWikitexts(data))}
                    else if (type==="externals") {setWikidata(data)}
                    else if (type==="texts"){setWikidata(reformatWikidata(data));return reformatWikidata(data)}
                    else {return reformatWikidata(data)}
                })
}

export const archiveEffect = props => () => {
    const {bookLabel, authorLabel, titleLabel} = props.data, {setData} = props;
    const title = bookLabel.split(", "[0])
    const searchUrl = 'https://archive.org/advancedsearch.php';
    const lastName = authorLabel.split(/[, ]+/).pop();
    const search = `(title:"${title}" OR title:"${titleLabel}") AND (text:"${authorLabel}" OR text:"${lastName}")`;
    const params = {q: search, output: 'json', fields: 'identifier,creator,title,language,year'
                    ,sort: ['downloads desc','year asc', 'addeddate asc'],rows: 20};
    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    fetch(`${searchUrl}?${queryString}`).then(response => response.json()).then(data => {setData(data.response.docs);})
      .catch(error => console.error(error));
}

export const googleEffect = props => () => {
    const {bookLabel, authorLabel, titleLabel} = props.data, {setData} = props;
    const title = bookLabel.split(", "[0])
    const lastName = authorLabel.split(/[, ]+/).pop();
    const query = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${authorLabel}+intitle:${title}+intitle:${titleLabel}+inauthor:${lastName}&key=${googleAPIKey}`
    fetch(query).then(response => response.json()).then(data => {setData(data.items);})
        .catch(error => console.error(error));
}

export const fetchSourceData = (props) => {fetchFunc(`${server}source_data?author=${props.data.authorLabel}&title=${props.data.titleLabel}&label=${props.data.bookLabel.split(", "[0])}&type=${props.type}`,props.setData)} //BNF or Gutenberg