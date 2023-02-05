import './App.css';
import AuthorTable from './views/AuthorTable.js';
import TextTable from './views/TextTable.js';
import authorData from './data/main_data.js';
import React from 'react';
import SiteHeader from './views/SiteHeader.js';
import SearchDetailed from './views/Search.js';
//import 'react-select-search/style.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

//Options for language dropdown
/*const languageOptions = [
  {label: 'English', value: 'en'},
];
*/
let listOfAuthors = authorData()["authors"];
let listOfTexts = authorData()["texts"];

const App = () => {
  const dataList = {listOfAuthors:listOfAuthors,listOfTexts:listOfTexts,}
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path = {"/"} element = {<SiteHeader data = {dataList} />}/>
        {listOfTexts.map((text) =>
          <Route path ={"/text/"+text.id} element = {
            <>
              <SiteHeader data = {dataList}/>
              <TextTable data={text}/>
            </>
          } key = {text.id}/>
        )}
        {listOfAuthors.map((author) => 
          <Route path={"/author/"+author.id} element={ //Adds a link for every author
            <div>
            <SiteHeader data = {dataList} />
            <AuthorTable data={author}/>
            </div>
            } key = {author.id}>
          </Route>)}
      <Route path = {"/search"} element = {
        <>
        <SiteHeader data = {dataList}/>
        <SearchDetailed data ={dataList}/>
        </>
        }        
        
      />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;