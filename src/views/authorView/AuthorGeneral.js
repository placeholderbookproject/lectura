import React,{useState, useEffect} from "react";
import {useLocation, useParams } from "react-router-dom";
import { fetchDataEffect, wikidataEffect } from "../apiEffects";
import AuthorTable from "./AuthorTable";
import AuthorTexts from "./AuthorTexts";
import WikiExternalsList from "../wikidata";
import ListReferences from "./ListReferences";
import TabComponent from "./TabComponent";

const AuthorGeneral = props => {
    const {lang, author, setAuthor, navigate, userData, text_id} = props.properties
    let { id } = useParams();    
    const location = useLocation();
    const defaultTabs = {"Biography":true, "Literature": true, "Lists":false};
    const [tabOpen, setTabOpen] = useState(defaultTabs)
    const [wikidata, setWikidata] = useState();
    const [q, setQ] = useState()
    const baseLink = author&&`/author/${author.author_id}`
    const handleClick = (id = null) => {
        const url = `${baseLink}/text/${id}`
        if (url!==location.pathname && id!==null) {
            const detailed = (tabOpen.det&&text_id !== id)?true:(tabOpen.det&&text_id===id?false:true)
            setTabOpen({...tabOpen, det:detailed})
            url !== location && navigate(url)
        } else {setTabOpen(defaultTabs);navigate(baseLink);}
    }
    const tabs = [{value:"bio",tabName:"Biography",component:<><AuthorTable properties = {{setQ, lang, author,setAuthor,userData, wikidata}}/>{q&&<WikiExternalsList q_number={q} language={lang.value}/>}</>},
                {value:"lit",tabName:"Literature",component:author&&<AuthorTexts author = {author} language={lang} handleClick={handleClick} text_id={text_id}/>},
                ,{tabName:"Lists", component:author&&<ListReferences type="author" id={author.author_id}/>}]
    useEffect(() => {
        if(author && author.author_q){
            setQ(author.author_q);
            const q_number = author.author_q.replace("http://www.wikidata.org/entity/","")
            wikidataEffect({q_number, setWikidata, type:"author", language:lang.value})();}
    },[author, lang])
    useEffect(() => {fetchDataEffect({type:'authors', id, setData:setAuthor,user_id:userData.user_id})()}, [id]);
    return (<TabComponent properties={{userData, tabs, tabOpen, setTabOpen, data:author, type:"author"}} />)
}
export default AuthorGeneral;