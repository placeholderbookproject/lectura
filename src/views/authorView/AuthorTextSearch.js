import React,{useState,useEffect} from "react";
const AuthorTextSearch = props => {
    const {originTexts, setTexts} = props.properties
    const [search, setSearch] = useState("");
    useEffect(() => {
        const toSearch = originTexts
        if(search==="") {setTexts(toSearch)}
        else if(originTexts && search) {setTexts(toSearch.filter((item) => item.bookLabel.toLowerCase().includes(search.toLowerCase())));}
    },[search])
    return (<input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}></input>)
}
export default AuthorTextSearch;