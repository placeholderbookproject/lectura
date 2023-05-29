import {Link} from 'react-router-dom'
import React from 'react';
import { Navbar, Container } from "react-bootstrap";
import labels from './labels.js'
import { langCodes } from '../div/langcodes.js';
import MainSearch from './MainSearch.js';

const SiteHeader = (props) => {
  const handleChange = e => {props.setLang({value:e.target.value, label:e.target.label});}
  return (
    <Container className = "flexbox-container">
      <Navbar style = {{paddingBottom: 5,paddingTop: 5,}}>{/*https://retool.com/blog/building-a-react-navbar/ */}
          <Link className="header-btn" to = {"/"}><button>{labels.homeBtn}</button></Link>
          <MainSearch/>
          <Link className="header-btn" to = {"/lists"}><button>Lists</button></Link>
          <select value = {props.lang.value} label={props.lang.value} onChange = {handleChange}>
              {langCodes.map((option) => (<option key = {option.value+option.label} value = {option.value}>{option.label}</option>) )}
          </select>
          {/*<LoginWindow/>*/}
      </Navbar>
    </Container>
  )
}
export default SiteHeader;