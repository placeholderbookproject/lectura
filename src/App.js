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
import { fetchDataEffect } from './views/apiEffects';

//Options for language dropdown
/*const languageOptions = [
  {label: 'English', value: 'en'},
];
*/

const RouteList = (props) => {
  const dataList = props.data
  return (
    <BrowserRouter>
    <Routes>
      <Route path = {"/"} element = {<SiteHeader data = {dataList} />}/>
      {dataList["texts"].map((text) =>
        <Route path ={"/text/"+text.text_id} element = { //importData.indexOf(row)
          <>
            <SiteHeader data = {dataList}/>
            <TextTable data={text}/>
          </>
        } key = {text.text_id}/>
      )}
      {dataList["authors"].map((author) => 
        <Route path={"/author/"+author.author_id} element={ //Adds a link for every author
          <div>
          <SiteHeader data = {dataList} />
          <AuthorTable author={author}/>
          </div>
          } key = {author.author_id}>
        </Route>)}
      {dataList["editions"].map((edition) => 
        <Route path = {"/text/"+edition.text_id+"/edition/"+edition.edition_id} key = {edition.edition_id}
          element={
          <>
            <SiteHeader data = {dataList}/>
            <EditionTable data = {edition}/>
          </>
          }
        >
        </Route>
      )}
    <Route path = {"/search"} element = {
      <>
      <SiteHeader data = {dataList}/>
      <SearchDetailed data ={dataList}/>
      </>
      }                
    />
    <Route path = {"/import"} element = {
        <>
          <SiteHeader data = {dataList}/>
          <ImportWindow/>
        </>
      }
    />
    <Route path = {"/admin"} element = {
      <>
        <SiteHeader data = {dataList}/>
        <Admin/>
      </>
      }
    />
    </Routes>
    </BrowserRouter>
  )  
}

const App = () => {
  const [data,setData] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(fetchDataEffect({setData, setLoading, type:null}),[])
  return (
    <div>
    {loading?<RouteList data = {data}/>:<></>}
    </div>
  );
}

export default App;