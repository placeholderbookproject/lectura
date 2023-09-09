import React, {useState, useEffect} from "react";
const UserElementSearch = props => {
    const {originData, setData, searchColumn} = props 
    const [query, setQuery] = useState("")
    useEffect(()=>{if(query.length>3){
        const dataToSearch = originData;
        const results = dataToSearch.filter((e) => e[searchColumn].includes(query))
        setData(results);}
        else {setData(originData)}
    },[query, originData, searchColumn, setData])
    return (<input type="text" placeholder="Search for an element" value={query} onChange={(e)=>setQuery(e.target.value)} className="search-input"/>)
}
export default UserElementSearch;