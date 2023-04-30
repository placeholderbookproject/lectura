import './App.css';
import AuthorTable from './views/AuthorTable.js';
import TextTable from './views/TextTable.js';
import React,{useState} from 'react';
import SiteHeader from './views/SiteHeader.js';
import SearchDetailed from './views/Search.js';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import EditionTable from './views/EditionTable.js';
import ImportWindow from './views/Import.js';
import Admin from './views/Admin.js';
import ListsTable from './views/Lists';
import {IntroPage} from './views/IntroPage.js';

//Options for language dropdown
/*const languageOptions = [
  {label: 'English', value: 'en'},
];
*/

const RouteList = () => {
  const [lang, setLang] = useState({value:"en", label:"English"})
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
            <TextTable/>
          </>
        }/>
        <Route path={"/author/:id"} element={
          <div>
            <SiteHeader setLang = {setLang} lang = {lang}/>
            <AuthorTable lang = {lang}/>
          </div>
          }/>
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
      <SearchDetailed/>
      </>
      }                
    />
    <Route path={"/lists"} element = {
      <>
        <SiteHeader setLang = {setLang} lang = {lang}/>
        <ListsTable lang={lang}/>
      </>
    }
    />
    <Route path = {"/import"} element = {
        <>
          <SiteHeader setLang = {setLang} lang = {lang}/>
          {/*<ImportWindow/>*/}
        </>
      }
    />
    <Route path = {"/admin"} element = {
      <>
        <SiteHeader setLang = {setLang} lang = {lang}/>
        {/*<Admin/>*/}
      </>
      }
    />
    </Routes>
    </BrowserRouter>
  )  
}

const App = () => {
  return (<div><RouteList/></div>);
}

export default App;