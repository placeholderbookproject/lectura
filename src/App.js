import './App.css';
import AuthorTable from './views/AuthorTable.js';
import TextTable from './views/TextTable.js';
import React, {useEffect, useState} from 'react';
import SiteHeader from './views/SiteHeader.js';
import SearchDetailed from './views/Search.js';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import EditionTable from './views/EditionTable.js';
import ImportWindow from './views/Import.js';
import Admin from './views/Admin.js';
import { fetchDataEffect } from './views/apiEffects.js';
import {IntroPage} from './views/IntroPage.js';

//Options for language dropdown
/*const languageOptions = [
  {label: 'English', value: 'en'},
];
*/

const RouteList = (props) => {
  //const dataList = props.data
  let searchPlaceholder = {};
  searchPlaceholder.texts = [{ "text_id": 1 }];
  return (
    <BrowserRouter>
    <Routes>
      <Route path = {"/"} element = {
        <>
        <SiteHeader data = {searchPlaceholder} />
        {/*<IntroPage data = {dataList}/>*/}
        </>
        }/>
        <Route path ={"/text/:id"} element = {
          <>
            <SiteHeader data = {searchPlaceholder}/>
            <TextTable/>
          </>
        }/>
      
        <Route path={"/author/:id"} element={ //Adds a link for every author
          <div>
          <SiteHeader data = {searchPlaceholder} />
          <AuthorTable/>
          </div>
          }/>
      {/*dataList["editions"].map((edition) => 
        <Route path = {"/text/"+edition.text_id+"/edition/"+edition.edition_id} key = {edition.edition_id}
          element={
          <>
            <SiteHeader data = {searchPlaceholder}/>
            <EditionTable edition = {edition}/>
          </>
          }
        >
        </Route>
      )*/}
    <Route path = {"/search"} element = {
      <>
      <SiteHeader data = {searchPlaceholder}/>
      {/*<SearchDetailed data ={dataList}/>*/}
      </>
      }                
    />
    <Route path = {"/import"} element = {
        <>
          <SiteHeader data = {searchPlaceholder}/>
          {/*<ImportWindow/>*/}
        </>
      }
    />
    <Route path = {"/admin"} element = {
      <>
        <SiteHeader data = {searchPlaceholder}/>
        {/*<Admin/>*/}
      </>
      }
    />
    </Routes>
    </BrowserRouter>
  )  
}

const App = () => {
  return (
    <div>
      <RouteList/>
    </div>
  );
}

export default App;