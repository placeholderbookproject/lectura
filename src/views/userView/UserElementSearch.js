import React, {useState, useEffect} from "react";
const UserElementSearch = props => {
    const {originData, setData} = props 
    const [query, setQuery] = useState("")
    useEffect(() => {
        if (query.length > 3) {
            const results = originData.filter(item => {
                return Object.values(item).some(value => typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase()));
            }); setData(results);
        } else {setData(originData);}
    }, [query, originData, setData]);
    return (<input type="text" placeholder="Search for an element" value={query} onChange={(e)=>setQuery(e.target.value)} className="search-input"/>)
}
export default UserElementSearch;