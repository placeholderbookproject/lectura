import React, {useState, useEffect} from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams, useNavigate} from 'react-router-dom';
import { fetchUserList, updateUserList } from '../apiEffects';
import ListAddElement from './ListAddElement';
import ListElement from './ListElement';
import AddComment from '../commentsView/AddComment';
import CommentView from '../commentsView/CommentView';
import ListInteractionButtons from './ListInteractionButtons';

const ListItem = props => {
    const {lang, userData} = props;
    let {listname, type} = useParams();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const list_id = !isNaN(listname.split("_")[0])&&listname.split("_")[0];
    const [info, setInfo] = useState(false);
    const [changes,setChanges] = useState({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[], delete:false})
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
    const deleteList = () => {updateUserList({...changes, delete:true}).then(()=>navigate("/lists"))}
    return (
        <div className="list-tab">
            <div className="list-tab-header">
                <span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span>
            </div>
            <div className="list-header">
                {<h2>{!edit?listInfo.list_name:<input type="text" value={listInfo.list_name} name="list_name" onChange={(e)=>changeInfo(e)}/>}
                    {listInfo.user_id&&userData.user_id===listInfo.user_id&&<>
                        <button onClick={()=>setEdit(!edit)} className="edit-btn">&#9998;</button>
                        <button className="delete-btn" onClick={()=>deleteList()}>Delete List</button>
                        {edit&&<button className="save-btn" onClick={()=>saveChanges()}>Save Changes</button>}</>}
                </h2>}
            {userData&&<ListInteractionButtons list_id={list_id} user_id={userData.user_id} userData={userData} navigate={navigate}
                            original_interactions={info&&{watchlist:info.watchlist, like:info.like, dislike:info.dislike}}/>}
                <div className="list-description">
                    {listInfo&&listInfo.list_created&&<p className="list-base-description">{`A personal list of ${listInfo.list_type} created by ${listInfo.user_name} on ${new Date(listInfo.list_created).toLocaleDateString(undefined, dateOptions)} 
                        ${listInfo.list_modified!==listInfo.list_created?` (last modified on ${new Date(listInfo.list_modified).toLocaleDateString(undefined, dateOptions)})`:""}`}</p>}
                    {!edit
                        ?<p>{listInfo.list_description}</p>
                        :<textarea className="list-text-area" name="list_description" value={listInfo.list_description} onChange={(e)=>changeInfo(e)}/>}
                </div>
            </div>
            {["all","official"].includes(type)&&info&&lists[info.list_info.list_url]}
            {edit&&<ListAddElement type={listInfo.list_type} info={info} setInfo={setInfo} changes={changes} setChanges={setChanges}/>}
            {!(info&&lists[info.list_info.list_url])&&<ListElement edit={edit} info={info} setInfo={setInfo} changes={changes} setChanges={setChanges}/>}
            {userData&&<AddComment user_id={userData.user_id} type="list" type_id ={list_id} buttonName="New Comment"/>}
            <CommentView comment_type="list" comment_type_id={list_id} userData={userData}/>
        </div>
    )
}

export default ListItem;