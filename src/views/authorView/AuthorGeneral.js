import React,{useState} from "react";
import { useParams, useLocation } from "react-router-dom";
import AuthorTable from "./AuthorTable";
import AuthorTexts from "./AuthorTexts";
import WikiExternalsList from "../wikidata";
import ListReferences from "./ListReferences";
import TabComponent from "./TabComponent";

const AuthorGeneral = props => {
    const {lang, author, setAuthor, navigate, setTextName, userData} = props.properties
    let { text_id } = useParams()
    const location = useLocation();
    const defaultTabs = {"Biography":true, "Literature": true, "Lists":false};
    const [tabOpen, setTabOpen] = useState(defaultTabs)
    const [q, setQ] = useState()
    const baseLink = author&&`/author/${author.author_id}`
    const handleClick = (id = null) => {
        const url = `${baseLink}/text/${id}`
        if (url!==location.pathname && id!==null) {
            const detailed = (tabOpen.det&&text_id !== id)?true:(tabOpen.det&&text_id===id?false:true)
            setTabOpen({...tabOpen, det:detailed})
            url !== location && navigate(url)
        } else {setTabOpen(defaultTabs);navigate(baseLink);setTextName(false);}
    }
    const tabs = [{value:"bio",tabName:"Biography",component:<><AuthorTable setQ={setQ} lang={lang} setAuthor={setAuthor}/>{q&&<WikiExternalsList q_number={q} language={lang.value}/>}</>},
                {value:"lit",tabName:"Literature",component:author&&<AuthorTexts author = {author} language={lang} handleClick={handleClick}/>},
                ,{tabName:"Lists", component:author&&<ListReferences type="author" id={author.author_id}/>}]
    return (<TabComponent properties={{userData, tabs, tabOpen, setTabOpen, data:author, type:"author"}} />)
}
export default AuthorGeneral;