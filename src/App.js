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
  const authorArray = Array.from({ length: 400000 }, (_, index) => index);
  const textArray = Array.from({ length: 89281}, (_,index) => index);
  return (
    <BrowserRouter>
    <Routes>
      <Route path = {"/"} element = {
        <>
        <SiteHeader data = {searchPlaceholder} />
        {/*<IntroPage data = {dataList}/>*/}
        </>
        }/>
      {textArray.map((text) =>
        <Route path ={"/text/"+text} element = { //importData.indexOf(row)
          <>
            <SiteHeader data = {searchPlaceholder}/>
            <TextTable text={text}/>
          </>
        } key = {text}/>
      )}
      {authorArray.map((author) => 
        <Route path={"/author/"+author} element={ //Adds a link for every author
          <div>
          <SiteHeader data = {searchPlaceholder} />
          <AuthorTable author={author}/>
          </div>
          } key = {author}>
        </Route>)}
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
  //const [data,setData] = useState({})
  //const [loading, setLoading] = useState(false)
  //useEffect(fetchDataEffect({setData, setLoading, type:null}),[])
  return (
    <div>
    {/*loading?*/

    <RouteList/>

    //:<></>
    }
    </div>
  );
}

export default App;