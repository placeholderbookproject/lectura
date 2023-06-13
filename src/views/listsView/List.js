import React, {useState, useEffect} from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams, useNavigate} from 'react-router-dom';
import { officialLists } from './availableLists';
import { fetchUserList } from '../apiEffects';

const ListItem = props => {
    const {lang} = props;
    const navigate = useNavigate();
    let {listname, type} = useParams();
    const list_id = !isNaN(listname.split("_")[0])&&listname.split("_")[0];
    const [info, setInfo] = useState(["all","official"].includes(type)&&officialLists.find(list => list.url === listname));
    const lists = {"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"}/>,
                    "authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>};
    useEffect(() => {if(list_id){fetchUserList(list_id, setInfo)}},[])
    return (
        <div className="list-tab">
            <span><button onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</button></span>
            <div className="list-header">
                <h2>{info.list_name}</h2>
                <p>{info.list_description}</p>
            </div>
            {["all","official"].includes(type)&&lists[listname]}
        </div>
    )
}
export default ListItem;