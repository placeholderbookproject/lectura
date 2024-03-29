import AuthorComponent from './views/authorView/AuthorComponent';
import TextComponent from './views/authorView/TextTable.js';
import React,{useState, useEffect} from 'react';
import SiteHeader from './views/SiteHeader.js';
import SearchDetailed from './views/searchView/SearchDetailed.js';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import ListsTab from './views/listsView/ListsView';
import {IntroPage} from './views/IntroPage.js';
import ListItem from './views/listsView/List';
import LoginView from './views/loginView/LoginForm';
import CreateUserForm from './views/loginView/CreateUserForm';
import ProfileView from './views/userView/ProfileView';
import CreateNewList from './views/listsView/CreateNewList';
import Cookies from 'js-cookie';
import { fetchLabels } from './views/apiEffects.js';
import AddNewView from './views/addNewView/AddNewView.js';
import BlogView from './views/blogView/BlogView.js';
import BrowseView from './views/browseView/BrowseView.js';

const RouteList = () => {
  const userCookie = Cookies.get('user')
  const [lang, setLang] = useState({value:navigator.language});
  const [userData, setUserData] = useState(userCookie?JSON.parse(userCookie):false);
  const [labels,setLabels] = useState(false);
  useEffect(() => {fetchLabels(lang.value,setLabels)},[lang.value])
  const routes = [{path:"/", element: <IntroPage lang = {lang} labels = {labels}/>},
      userData&&{path:"/add",element:<AddNewView lang={lang} userData={userData} labels={labels}/>},
      {path:"/text/:id",element:<TextComponent lang={lang} userData={userData} labels = {labels}/>},
      {path:"/author/:id",element:<AuthorComponent lang = {lang} userData={userData} setUserData={setUserData} labels = {labels}/>},
      {path:"/author/:id/text/:text_id",element:<AuthorComponent lang = {lang}  userData={userData} setUserData={setUserData} labels={labels}/>},
      {path:"/search", element:<SearchDetailed lang={lang} userData={userData} labels = {labels}/>},
      {path:"/browse", element:<BrowseView lang={lang} labels={labels}/>},
      {path:"/lists",element:<ListsTab lang={lang} userData={userData} setUserData={setUserData} labels = {labels}/>},
      {path:"/lists/create_new", element:<CreateNewList lang={lang} userData={userData} labels = {labels}/>},
      {path:"/lists/:type/:listname", element:<ListItem lang={lang} userData={userData} labels = {labels}/>},
      {path:"/login", element:<LoginView setUserData={setUserData} labels = {labels}/>},
      userData&&{path:"/blog",element:<BlogView userData={userData} labels={labels}/>},
      !userData&&{path:"/register",element:<CreateUserForm setUserData={setUserData} labels = {labels}/>},
      userData&&{path:"/user/show/:user_site", element:<ProfileView setUserData={setUserData} userData={userData} lang={lang} labels={labels}/>}
  ].filter(Boolean)
  return (
    <BrowserRouter>
    <Routes>
      {labels&&routes.map((route, index) => (
        <Route key={index} path={route.path} element={<><SiteHeader properties = {{setLang, lang, userData, setUserData, labels}}/>{route.element}</>}/>
      ))}
      </Routes>
    </BrowserRouter>
  ); 
}
export default RouteList; 