import React,{useState} from "react";
import {useLocation} from "react-router-dom";
import AuthorTable from "./AuthorTable";
import AuthorTexts from "./AuthorTexts";
import ListReferences from "./ListReferences";
import TabComponent from "./TabComponent";

const AuthorGeneral = props => {
    const {lang, author,texts, navigate, userData, setUserData, text_id, labels} = props.properties
    const location = useLocation();
    const defaultTabs = {"Biography":true, "Literature": true, "Lists":true};
    const [tabOpen, setTabOpen] = useState(defaultTabs)
    const baseLink = author&&`/author/${author.author_id}`
    const handleClick = (id = null) => {
        const url = `${baseLink}/text/${id}`
        if (url!==location.pathname && id!==null) {
            const detailed = (tabOpen.det&&text_id !== id)?true:(tabOpen.det&&text_id===id?false:true)
            setTabOpen({...tabOpen, det:detailed})
            url !== location && navigate(url)
        } else {setTabOpen(defaultTabs);navigate(baseLink);}
    }
    const tabs = [{value:"bio",tabName:"Biography",component:<AuthorTable properties = {{lang, author, labels}}/>}
    ,texts.length>0&&{value:"lit",tabName:"Literature",component:author&&<AuthorTexts properties = {{author,texts, language: lang, handleClick, userData, setUserData}} />}
                ,{tabName:"Lists", component:author&&<ListReferences type="author" id={author.author_id} userData={userData} setTabOpen={setTabOpen} tabOpen={tabOpen}/>}]
    return (<TabComponent properties={{userData, tabs, tabOpen, setTabOpen, data:author, type:"author"}} />)
}
export default AuthorGeneral;