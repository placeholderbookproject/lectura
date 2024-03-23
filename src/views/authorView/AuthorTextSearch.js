import React,{useState,useEffect} from "react";
const AuthorTextSearch = ({originData, setData}) => {
    const [search, setSearch] = useState("");
    useEffect(() => {
        const toSearch = originData
        if(search==="") {setData(toSearch)}
        else if(originData && search) {setData(toSearch.filter((item) => item.bookLabel.toLowerCase().includes(search.toLowerCase())));}
    },[search])
    return (<input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}></input>)
}
export default AuthorTextSearch;