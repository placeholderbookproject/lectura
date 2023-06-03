import React, {useState} from 'react';
import AuthorsByBooksTable from './AuthorsByBooks';
import { useParams} from 'react-router-dom';

const ListItem = props => {
    const {lang} = props;
    const lists = {official:{"authors-by-books":<AuthorsByBooksTable lang={lang}/>}};
    let {listname, type} = useParams();
    console.log(listname, type)
    return (
        <div>
        {lists[type][listname]}
        </div>
    )
}
export default ListItem;