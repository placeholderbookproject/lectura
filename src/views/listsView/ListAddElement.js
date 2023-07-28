import React, {useState, useEffect} from "react"
import { fetchSearchResults } from '../apiEffects';

const ListAddElement = (props) => {
    const {info, setInfo, changes, setChanges, filters, type} = props.properties
    const [query, setQuery] = useState("")
    const searchSelect = (e) => {setQuery(e.target.value);}
    const [searchResults, setSearchResults] = useState([])
    let controller = new AbortController();
    useEffect (()=> {
        const cleanup = () => {if (controller) {controller.abort();}};
        controller = new AbortController();
        query&&query.length>3&&fetchSearchResults({setSearchResults,query,type:type,filters,signal:controller.signal})();
        return cleanup
    },[query]);
    const search = (event) => {if (event.key==="Escape"){setQuery("");setSearchResults();}}
    const results = searchResults&&searchResults.length>0?searchResults:[]
    const addElement = (element) => {
        const oldList = info;
        const newElement = [...oldList.list_detail,...[element]]
        console.log(newElement)
        setInfo({...oldList,list_detail:newElement})
        const oldChanges = changes
        setChanges({...oldChanges,additions:[...oldChanges.additions,...[element]],removals:oldChanges.removals,
                    list_info:oldChanges.list_info, order_changes:oldChanges.order_changes})
    }
    return (
        <div className="list-add-element-container">
            <div className="list-element-search">
                <input type="text" placeholder={`Add a new ${info&&info.list_info.list_type.replace("s","")} to your list`} value = {query} onChange = {searchSelect} onKeyDown={search} 
                    className="search-input"/>
            </div>
            <div className="search-result-list">
                {results.map((item)=> <span className="list-search-result" key={item.value}><p onClick = {()=>addElement(item)}>{item.label}</p></span>)}
            </div>
        </div>
    )
}

export default ListAddElement;