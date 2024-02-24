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
import CreateUserForm from './views/loginView/CreateUserForm';
import ProfileView from './views/userView/ProfileView';
import CreateNewList from './views/listsView/CreateNewList';
import Cookies from 'js-cookie';

const RouteList = () => {
  const userCookie = Cookies.get('user')
  const [lang, setLang] = useState({value:navigator.language});
  const [userData, setUserData] = useState(userCookie?JSON.parse(userCookie):false);
  const routes = [{path:"/", element: <IntroPage lang = {lang}/>},
      {path:"/text/:id",element:<TextComponent lang={lang} userData={userData}/>},
      {path:"/author/:id",element:<AuthorComponent lang = {lang} userData={userData} setUserData={setUserData}/>},
      {path:"/author/:id/text/:text_id",element:<AuthorComponent lang = {lang}  userData={userData} setUserData={setUserData}/>},
      {path:"/search", element:<SearchDetailed lang={lang} userData={userData}/>},
      {path:"/lists",element:<ListsTab lang={lang} userData={userData} setUserData={setUserData}/>},
      {path:"/lists/create_new", element:<CreateNewList lang={lang} userData={userData}/>},
      {path:"/lists/:type/:listname", element:<ListItem lang={lang} userData={userData}/>},
      {path:"/login", element:<LoginView setUserData={setUserData}/>},
      !userData&&{path:"/register",element:<CreateUserForm setUserData={setUserData}/>},
      {path:"/user/show/:user_site", element:<ProfileView setUserData={setUserData} userData={userData} lang = {lang}/>}
  ]
  return (
    <BrowserRouter>
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={<><SiteHeader setLang={setLang} lang={lang} userData={userData} setUserData={setUserData}/>{route.element}</>}/>
      ))}
      </Routes>
    </BrowserRouter>
  ); 
}
export default RouteList; 