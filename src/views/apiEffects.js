export const fetchDataEffect = props => () => {
    fetch('http://127.0.0.1:8000/data?type=texts&id='+props.author_id)
    .then(response => {if(response.ok) {return response.json()}throw response})
    .then(results => {props.setData(results)}
    )
}

export const fetchSearchResults = props => () => {
        if(props.query.length>3) {
          fetch('http://127.0.0.1:8000/search?query='+props.query+"&type="+props.type)
          .then(response => {
              if (response.ok) {return response.json()} throw response;})
          .then (data => 
            {props.setSearchResults(data[props.type])
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