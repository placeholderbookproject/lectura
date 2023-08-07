import React,{useState, useEffect} from "react";
import { fetchListReferences } from "../apiEffects";

const ListReference = props => {
    const {list_id, list_name, list_created, user_name} = props.data
    const list_url = `${list_id}_${list_name}`
    const list_label = `'${list_name}' by ${user_name} (${list_created})`
    return (<p className="list-reference-row" key={list_url}><a href={`/lists/all/${list_url}`} className="archiveRow">{list_label}</a></p>)
}
const ListReferences = props => {
    const [lists, setLists] = useState([])
    useEffect(() => {fetchListReferences(props.type, props.id, setLists)},[props.id, props.type])
    return (<>{lists.length>0&&lists.map(list => <ListReference data={list}/>)}</>)
}
export default ListReferences;