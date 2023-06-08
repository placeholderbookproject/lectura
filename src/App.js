import './App.css';
import AuthorComponent from './views/authorView/AuthorComponent';
import TextComponent from './views/authorView/TextTable.js';
import React,{useState} from 'react';
import SiteHeader from './views/SiteHeader.js';
import SearchDetailed from './views/searchView/SearchDetailed.js';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import ListsTab from './views/listsView/ListsView';
import {IntroPage} from './views/IntroPage.js';
import ListItem from './views/listsView/List';
import LoginView from './views/loginView/LoginForm';

const RouteList = () => {
  const [lang, setLang] = useState({value:"en", label:"English"});
  const [userId, setUserId] = useState(false);
  return (
    <BrowserRouter>
    <Routes>
      <Route path = {"/"} element = {
        <>
          <SiteHeader setLang = {setLang} lang = {lang}/>
          <IntroPage lang = {lang}/>
        </>
        }/>
        <Route path ={"/text/:id"} element = {
          <>
            <SiteHeader setLang = {setLang} lang = {lang}/>
            <TextComponent lang={lang}/>
          </>
        }/>
        <Route path={"/author/:id"} element={
          <div>
            <SiteHeader setLang = {setLang} lang = {lang}/>
            <AuthorComponent lang = {lang}/>
          </div>}
        />
        <Route path={"/author/:id/text/:text_id"} element={
          <div>
            <SiteHeader setLang = {setLang} lang = {lang}/>
            <AuthorComponent lang = {lang}/>
          </div>}
        />
      {/*dataList["editions"].map((edition) => 
        <Route path = {"/text/"+edition.text_id+"/edition/"+edition.edition_id} key = {edition.edition_id}
          element={
          <>
            <SiteHeader/>
            <EditionTable edition = {edition}/>
          </>
          }
        >
        </Route>
      )*/}
    <Route path = {"/search"} element = {
      <>
      <SiteHeader setLang = {setLang} lang = {lang}/>
      <SearchDetailed lang={lang}/>
      </>}                
    />
    <Route path={"/lists"} element = {
      <>
        <SiteHeader setLang = {setLang} lang = {lang}/>
        <ListsTab lang={lang}/>
      </>}
    />
    <Route path={"/lists/:type/:listname"} element = {
      <>
        <SiteHeader setLang = {setLang} lang = {lang}/>
        <ListItem lang={lang}/>
      </>}
    />
    <Route path = {"/import"} element = {
        <>
          <SiteHeader setLang = {setLang} lang = {lang}/>
          {/*<ImportWindow/>*/}
        </>}
    />
    <Route path = {"/admin"} element = {
      <>
        <SiteHeader setLang = {setLang} lang = {lang}/>
        {/*<Admin/>*/}
      </>}
    />
    <Route path="/login" element={<LoginView setUserId={setUserId}/>}/>
    </Routes>
    </BrowserRouter>
  )  
}

const App = () => {
  return (<div><RouteList/></div>);
}

export default App;