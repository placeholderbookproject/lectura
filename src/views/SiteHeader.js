import {Link} from 'react-router-dom'
import React from 'react';
import { Navbar, Container } from "react-bootstrap";
import labels from './labels.js'
import { langCodes } from '../div/langcodes.js';
import MainSearch from './searchView/MainSearch.js';
import ProfileDropdown from './userView/ProfileDropdown.js';

const SiteHeader = (props) => {
  const handleChange = e => {props.setLang({value:e.target.value, label:e.target.label});}
  return (
    <Container className = "flexbox-container">
      <Navbar style = {{paddingBottom: 5,}}>
          <Link className="header-btn" to="/"><button>{labels.homeBtn}</button></Link>
          <MainSearch/>
          <Link className="header-btn" to ="/lists"><button>Lists</button></Link>
          <ProfileDropdown userData={props.userData}/>
          <select value = {props.lang.value} label={props.lang.value} onChange = {handleChange} className="language-select">
              {langCodes.map((option) => (<option key = {option.value+option.label} value = {option.value}>{option.label}</option>) )}
          </select>
      </Navbar>
    </Container>
  )
}
export default SiteHeader;