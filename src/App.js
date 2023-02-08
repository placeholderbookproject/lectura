import './App.css';
import AuthorTable from './views/AuthorTable.js';
import TextTable from './views/TextTable.js';
import React, {useEffect, useState} from 'react';
import SiteHeader from './views/SiteHeader.js';
import SearchDetailed from './views/Search.js';
//import 'react-select-search/style.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import EditionTable from './views/EditionTable.js';
import ImportWindow from './views/Import.js';

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
        <Route path ={"/text/"+text.id} element = {
          <>
            <SiteHeader data = {dataList}/>
            <TextTable data={text}/>
          </>
        } key = {text.id}/>
      )}
      {dataList["authors"].map((author) => 
        <Route path={"/author/"+author.id} element={ //Adds a link for every author
          <div>
          <SiteHeader data = {dataList} />
          <AuthorTable data={author}/>
          </div>
          } key = {author.id}>
        </Route>)}
      {dataList["editions"].map((edition) => 
        <Route path = {"/text/"+edition.text_index+"/edition/"+edition.id} key = {edition.id}
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
          <ImportWindow />
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
  useEffect( () => {
    const fetchData = () => {
      const requestOptions = {
        method: 'GET',
                  };
      fetch('http://127.0.0.1:8000/data', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response;
      })
      .then (data => {setData(data)})
      .finally( () => setLoading(true))
    }
    fetchData()
  },[])
  return (
    <div>
    {loading?<RouteList data = {data}/>:<></>}
    </div>
  );
}

export default App;