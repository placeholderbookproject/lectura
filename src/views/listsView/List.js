import React from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams, useNavigate} from 'react-router-dom';
import { availableLists } from './availableLists';

const ListItem = props => {
    const {lang} = props;
    const navigate = useNavigate();
    const lists = {official:{"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"}/>,
                    "authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>}};
    let {listname, type} = useParams();
    const info = availableLists[type].find(list => list.url === listname)
    return (
        <div className="list-tab">
            <span><p onClick = {() => navigate("/lists/")} className="return-btn">&#8592; Return to List Overview</p></span>
            <div className="list-header">
                <h2>{info.title}</h2>
                <p>{info.descr}</p>
            </div>
            {lists[type][listname]}
        </div>
    )
}
export default ListItem;