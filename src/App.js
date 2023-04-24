import './App.css';
import AuthorTable from './views/AuthorTable.js';
import TextTable from './views/TextTable.js';
import React from 'react';
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
  return (
    <BrowserRouter>
    <Routes>
      <Route path = {"/"} element = {
        <>
          <SiteHeader/>
          <IntroPage/>
        </>
        }/>
        <Route path ={"/text/:id"} element = {
          <>
            <SiteHeader/>
            <TextTable/>
          </>
        }/>
        <Route path={"/author/:id"} element={
          <div>
            <SiteHeader/>
            <AuthorTable/>
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
      <SiteHeader/>
      <SearchDetailed/>
      </>
      }                
    />
    <Route path={"/lists"} element = {
      <>
        <SiteHeader/>
        <ListsTable/>
      </>
    }
    />
    <Route path = {"/import"} element = {
        <>
          <SiteHeader/>
          {/*<ImportWindow/>*/}
        </>
      }
    />
    <Route path = {"/admin"} element = {
      <>
        <SiteHeader/>
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