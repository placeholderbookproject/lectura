import React, {useState, useEffect} from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams, useNavigate} from 'react-router-dom';
import { officialLists } from './availableLists';
import { fetchUserList, updateUserList } from '../apiEffects';
import ListAddElement from './ListAddElement';
import ListElement from './ListElement';

const ListItem = props => {
    const {lang, userData} = props;
    let {listname, type} = useParams();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const list_id = !isNaN(listname.split("_")[0])&&listname.split("_")[0];
    const [info, setInfo] = useState(["all","official"].includes(type)&&!list_id&&officialLists.find(list => list.url === listname));
    const [changes,setChanges] = useState({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[]})
    const lists = {"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"}/>,
                    "authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>};
    useEffect(() => {if(list_id){fetchUserList(list_id, setInfo)}},[])
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const listInfo = info&&info.list_info?info.list_info:info
    const changeInfo = (event) => {
        setInfo(prevInfo => {
                let updatedInfo = { ...prevInfo };
                updatedInfo.list_info[event.target.name] = event.target.value
                return updatedInfo;})
        const oldChanges = changes;
        setChanges({...oldChanges, list_info:{...oldChanges.list_info, [event.target.name]:event.target.value}})
    }
    const saveChanges = () => {
        if(changes.additions.length>0||changes.removals.length>0||Object.keys(changes.list_info).length>1||changes.order_changes.length>0){
            updateUserList(changes).then(() => setEdit(!edit)).catch((error) => console.log(error));
            setChanges({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[]})}}
    return (
        <div className="list-tab">
            <span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span>
            <div className="list-header">
                {<h2>{!edit?listInfo.list_name:<input type="text" value={listInfo.list_name} name="list_name" onChange={(e)=>changeInfo(e)}/>}
                    {userData.user_id===listInfo.user_id&&<>
                        <button onClick={()=>setEdit(!edit)} className="edit-btn">&#9998;</button>
                        {edit&&<button className="save-btn" onClick={()=>saveChanges()}>Save Changes</button>}</>}
                </h2>}
                <div className="list-description">
                    {listInfo&&listInfo.list_created&&<p className="list-base-description">{`A personal list of ${listInfo.list_type} created by ${listInfo.user_name} on ${new Date(listInfo.list_created).toLocaleDateString(undefined, dateOptions)} 
                        ${listInfo.list_modified!==listInfo.list_created?` (last modified on ${new Date(listInfo.list_modified).toLocaleDateString(undefined, dateOptions)})`:""}`}</p>}
                    {!edit
                        ?<p>{listInfo.list_description}</p>
                        :<textarea className="list-text-area" name="list_description" value={listInfo.list_description} onChange={(e)=>changeInfo(e)}/>}
                </div>
            </div>
            {["all","official"].includes(type)&&lists[listname]}
            {edit&&<ListAddElement type={listInfo.list_type} info={info} setInfo={setInfo} changes={changes} setChanges={setChanges}/>}
            {<ListElement edit={edit} info={info} setInfo={setInfo} changes={changes} setChanges={setChanges}/>}
        </div>
    )
}

export default ListItem;