import React, {useState, useEffect} from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams, useNavigate, useSearchParams} from 'react-router-dom';
import { fetchUserList } from '../apiEffects';
import ListAddElement from './ListAddElement';
import ListElements from './ListElement';
import AddComment from '../commentsView/AddComment';
import CommentView from '../commentsView/CommentView';
import ListHeader from './ListHeader';

const ListItem = props => {
    const {lang, userData} = props;
    let {listname, type} = useParams();
    const [info, setInfo] = useState(false);
    const [searchParams,setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(searchParams.get('edit')==="true"?true:false);
    const [editable, setEditable] = useState(false);
    const list_id = !isNaN(listname.split("_")[0])&&listname.split("_")[0];
    const [changes,setChanges] = useState({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[], delete:false, userData})
    const [filters, setFilters] = useState([])
    const lists = {"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"}/>,"authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>};
    useEffect(() => {if(list_id){fetchUserList(list_id, props.userData&&props.userData.user_id,props.userData&&props.userData.hash,setInfo)}},[])
    useEffect(() => {if(info&&(userData.user_id===info.list_info.user_id)){setEditable(true)} else{setEditable(false)}},[info])
    return (
        info&&
        <div className="list-tab">
            <div className="list-tab-header"><span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span></div>
            <ListHeader data={{listInfo:info.list_info, userData, edit, setEdit, changes, setChanges, info, setInfo, list_id, navigate, type:type.replace("s",""), setSearchParams, editable}}/>
            {["all","official"].includes(type)&&info&&lists[info.list_info.list_url]}
            {editable&&edit&&<ListAddElement properties = {{type:info.list_info.list_type, info, setInfo, changes, setChanges, filters}}/>}
            {!(info&&lists[info.list_info.list_url])&&<><ListElements properties = {{edit, info, setInfo, changes, setChanges, userData, filters, setFilters}}/></>}
            {userData&&<AddComment user_id={userData.user_id} type="list" type_id ={list_id} buttonName="New Comment"/>}
            <CommentView comment_type="list" comment_type_id={list_id} userData={userData}/>
        </div>
    )
}

export default ListItem;