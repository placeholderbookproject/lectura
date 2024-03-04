import {Link} from 'react-router-dom'
import React from 'react';
import { Navbar, Container } from "react-bootstrap";
import { langCodes } from '../div/langcodes.js';
import MainSearch from './searchView/MainSearch.js';
import ProfileDropdown from './userView/ProfileDropdown.js';

const SiteHeader = (props) => {
  const {labels, setLang, lang,userData, setUserData} = props.properties
  const handleChange = e => {setLang({value:e.target.value, label:e.target.label});}
  return (
    <Container className = "flexbox-container">
      <Navbar style = {{paddingBottom: 5,}}>
          <Link className="header-btn" to="/"><button>{labels.homeBtn}</button></Link>
          <MainSearch labels={labels}/>
          <Link className="header-btn" to ="/lists"><button>{labels.lists}</button></Link>
          <ProfileDropdown userData={userData} setUserData={setUserData}/>
          <select value = {lang.value} label={lang.value} onChange = {handleChange} className="language-select">
              {langCodes.map((option) => (<option key = {option.value+option.label} value = {option.value}>{option.label}</option>) )}
          </select>
      </Navbar>
    </Container>
  )
}
export default SiteHeader;