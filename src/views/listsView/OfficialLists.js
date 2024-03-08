import React, {useState, useEffect} from "react";
import UserElementInteractionsList from "../userView/UserElementInteractionsList";
import CheckList from "../userView/CheckList";
import AuthorsByBooksTable from "./AuthorsByBooks";
import { fetchUserData, wikidataEffectProfile } from "../apiEffects";
import { processLists, extract_q } from "../userView/ProfileView";

const ProfileLists = ({userData, lang, type}) => {
    const [data, setData] = useState({})
    const [wiki, setWiki] = useState({})
    useEffect(()=>{fetchUserData(userData.user_id, setData)},[userData.user_id])
    useEffect(() => {if(Object.keys(data).length>0){
        wikidataEffectProfile({ results: extract_q(data), language: lang.value })()
            .then(wiki => setWiki(processLists(data, wiki)))} // Call processLists with both data and wiki
    },[data,lang])
    const id_type_list = {author_watch:"author_id", watch:"text_id", user_lists_watchlists:"list_id", favorites:"text_id",dislikes:"text_id"}
    const lists = {watchlists:<UserElementInteractionsList userData={userData} data={wiki} lists={[{label:"Authors",value:"author_watch"},{label:"Texts", value:"watch"},{label:"Lists", value:"user_lists_watchlists"}]}
                    id_type_list={id_type_list}/>
                    ,checks:<CheckList userData={userData} data={wiki["checks"]}/> }
    return (Object.keys(wiki).length>0&&lists[type])
}
const OfficialLists = ({lang, userData, url}) => {
    const lists = {"authors-by-books":<AuthorsByBooksTable lang={lang} type={"num_books"} /> ,"authors-no-books":<AuthorsByBooksTable lang={lang} type={"no_books"}/>
                    ,'watchlists':<ProfileLists userData={userData} type={"watchlists"} lang={lang}/>,'text-checks':<ProfileLists userData={userData} type={"checks"} lang={lang}/>};
    return (lists[url])
}
export default OfficialLists;