import React, {useState, useEffect} from 'react';
import { useParams, useNavigate, useSearchParams} from 'react-router-dom';
import { fetchUserList } from '../apiEffects';
import ListAddElement from './ListAddElement';
import ListElements from './ListElement';
import ListHeader from './ListHeader';
import CommentSection from '../commentsView/CommentSection';
import OfficialLists from './OfficialLists';

const ListItem = props => {
    const {lang, userData} = props;
    let {listname, type} = useParams();
    const [info, setInfo] = useState(false);
    console.log(info)
    const [searchParams,setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(searchParams.get('edit')==="true"?true:false);
    const [editable, setEditable] = useState(false);
    const list_id = !isNaN(listname.split("_")[0])&&listname.split("_")[0];
    const [changes,setChanges] = useState({additions:[], removals:[],list_info:{list_id:list_id}, order_changes:[], delete:false, userData})
    const [filters, setFilters] = useState([])
    useEffect(() => {if(list_id){fetchUserList(list_id, props.userData&&props.userData.user_id,props.userData&&props.userData.hash,setInfo)}},[])
    useEffect(() => {if(info&&(userData.user_id===info.list_info.user_id||userData.user_role==='administrator')){setEditable(true)} else{setEditable(false)}},[info])
    return (
        info&&
        <div className="list-tab">
            <div className="list-tab-header"><span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span></div>
            <ListHeader data={{listInfo:info.list_info, userData, edit, setEdit, changes, setChanges, info, setInfo, list_id, navigate, type:type.replace("s",""), setSearchParams, editable}}/>
            {(["all","official"].includes(type)&&info)&&<OfficialLists url={info.list_info.list_url} lang={lang} userData={userData}/>}
            {editable&&edit&&<ListAddElement properties = {{type:info.list_info.list_type, info, setInfo, changes, setChanges, filters}}/>}
            {type!=="official"&&<ListElements properties = {{edit, info, setInfo, changes, setChanges, userData, filters, setFilters}}/>}
            <CommentSection properties={{userData, type:"list", type_id:list_id, buttonName:"New Comment"}}/>
        </div>
    )
}

export default ListItem;