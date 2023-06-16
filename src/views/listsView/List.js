import React, {useState, useEffect} from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams, useNavigate} from 'react-router-dom';
import { officialLists } from './availableLists';
import { fetchUserList } from '../apiEffects';
import ListAddElement from './ListAddElement';
import ListElement from './ListElement';

const ListItem = props => {
    const {lang, userData} = props;
    let {listname, type} = useParams();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const list_id = !isNaN(listname.split("_")[0])&&listname.split("_")[0];
    const [info, setInfo] = useState(["all","official"].includes(type)&&officialLists.find(list => list.url === listname));
    const lists = {"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"}/>,
                    "authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>};
    useEffect(() => {if(list_id){fetchUserList(list_id, setInfo, type)}},[])
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const listInfo = info&&info.list_info
    return (
        <div className="list-tab">
            <span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span>
            <div className="list-header">
                <h2>{listInfo.list_name}
                    {userData.user_id===listInfo.user_id&&<button onClick={()=>setEdit(!edit)} className="edit-btn">&#9998;</button>}
                </h2>
                <div className="list-description">
                    {listInfo&&listInfo.list_created&&<p className="list-base-description">{`A personal list of ${type} created by ${listInfo.user_name} on ${new Date(listInfo.list_created).toLocaleDateString(undefined, dateOptions)} 
                        ${listInfo.list_modified!==listInfo.list_created?` (last modified on ${new Date(listInfo.list_modified).toLocaleDateString(undefined, dateOptions)})`:""}`}</p>}
                    <p></p>
                    <p>{listInfo.list_description}</p>
                </div>
            </div>
            {["all","official"].includes(type)&&lists[listname]}
            {edit&&<ListAddElement type={type} info={info} setInfo={setInfo}/>}
            {<ListElement edit={edit} info={info} setInfo={setInfo}/>}
        </div>
    )
}

/*To dos for list page:
    (3. Format header part of list to also have (versioning, watchList))
    4. Button to add titles -> search -> click => add
    5. List Components in edit view -> remove ability, drag&drop ability, ((comments))
    (6. Comments on list)
    (7. Comments on individual list components)
*/
//Add user ID, User Name, list type,userData (who is logged in info) => match these => edit available => + click to add titles

export default ListItem;