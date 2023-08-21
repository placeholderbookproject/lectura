import React, {useState, useEffect} from "react";
import WatchList from "../userView/WatchList";
import CheckList from "../userView/CheckList";
import AuthorsByBooksTable from "./AuthorsByBooks";
import { fetchUserData } from "../apiEffects";

const ProfileLists = props => {
    const [data, setData] = useState({})
    useEffect(()=>{fetchUserData(props.userData.user_id, setData)},[])
    const lists = {watchlists:<WatchList userData={props.userData} data={data}/>, checks:<CheckList userData={props.userData} data={data}/> }
    return (Object.keys(data).length>0&&lists[props.type])
}
const OfficialLists = props => {
    const {lang, userData} = props
    const lists = {"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"}/>
    ,"authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>
    ,'watchlists':<ProfileLists userData={userData} type={"watchlists"}/>
    ,'text-checks':<ProfileLists userData={userData} type={"checks"}/>};
    return (lists[props.url])
}
export default OfficialLists;