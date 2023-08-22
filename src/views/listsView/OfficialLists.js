import React, {useState, useEffect} from "react";
import UserElementInteractionsList from "../userView/UserElementInteractionsList";
import CheckList from "../userView/CheckList";
import AuthorsByBooksTable from "./AuthorsByBooks";
import { fetchUserData } from "../apiEffects";

const ProfileLists = props => {
    const [data, setData] = useState({})
    useEffect(()=>{fetchUserData(props.userData.user_id, setData)},[])
    const id_type_list = {author_watch:"author_id", watch:"text_id", user_lists_watchlists:"list_id", favorites:"text_id",dislikes:"text_id"}
    const lists = {watchlists:<UserElementInteractionsList userData={props.userData} data={data} lists={[{label:"Authors",value:"author_watch"},{label:"Texts", value:"watch"},{label:"Lists", value:"user_lists_watchlists"}]}
            id_type_list={id_type_list}/>
            , checks:<CheckList userData={props.userData} data={data}/> }
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