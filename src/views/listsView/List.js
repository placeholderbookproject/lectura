import React, {useState, useEffect} from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams, useNavigate} from 'react-router-dom';
import { fetchUserList } from '../apiEffects';
import ListAddElement from './ListAddElement';
import ListElement from './ListElement';
import AddComment from '../commentsView/AddComment';
import CommentView from '../commentsView/CommentView';
import ListHeader from './ListHeader';

const ListItem = props => {
    const {lang, userData} = props;
    let {listname, type} = useParams();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const list_id = !isNaN(listname.split("_")[0])&&listname.split("_")[0];
    const [info, setInfo] = useState(false);
    const [changes,setChanges] = useState({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[], delete:false, userData})
    const lists = {"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"}/>,"authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>};
    useEffect(() => {if(list_id){fetchUserList(list_id, props.userData&&props.userData.user_id,props.userData&&props.userData.hash,setInfo)}},[])
    const listInfo = info&&info.list_info?info.list_info:info
    return (
        <div className="list-tab">
            <div className="list-tab-header">
                <span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span>
            </div>
            <ListHeader data={{listInfo, userData, edit, setEdit, changes, setChanges, info, setInfo, list_id, navigate}}/>
            {["all","official"].includes(type)&&info&&lists[info.list_info.list_url]}
            {edit&&<ListAddElement type={listInfo.list_type} info={info} setInfo={setInfo} changes={changes} setChanges={setChanges}/>}
            {!(info&&lists[info.list_info.list_url])&&<>
                <ListElement edit={edit} info={info} setInfo={setInfo} changes={changes} setChanges={setChanges} userData={userData}/></>}
            {userData&&<AddComment user_id={userData.user_id} type="list" type_id ={list_id} buttonName="New Comment"/>}
            <CommentView comment_type="list" comment_type_id={list_id} userData={userData}/>
        </div>
    )
}

export default ListItem;