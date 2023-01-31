import './App.css';
//import SearchDetailed from './views/Search.js';
import AuthorTable from './views/AuthorTable.js';
import TextTable from './views/TextTable.js';
import authorData from './data/main_data.js';
import React from 'react';
import SiteHeader from './views/SiteHeader.js';
import SearchDetailed from './views/Search.js';
//import 'react-select-search/style.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

//Use bootstrap?

//Options for language dropdown
/*const languageOptions = [
  {label: 'English', value: 'en'},
];
*/
let listOfAuthors = authorData()["authors"];
let listOfWorks = authorData()["work"];

function App () {
  const dataList = {listOfAuthors:listOfAuthors,listOfWorks:listOfWorks,}
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path = {"/"} element = {<SiteHeader data = {dataList} />}/>
        {listOfWorks.map((work) =>
          <Route path ={"/work/"+work.id} element = {
            <>
              <SiteHeader data = {dataList}/>
              <TextTable data={work}/>
            </>
          } key = {work.id}/>
        )}
        {listOfAuthors.map((author) => 
          <Route path={"/author/"+author.id} element={ //Adds a link for every author
            <>
            <SiteHeader data = {dataList} />
            <AuthorTable data={author}/>
            </>
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
