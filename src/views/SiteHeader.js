import {Link} from 'react-router-dom'
import React from 'react';
import { Navbar, Container } from "react-bootstrap";
import labels from './labels.js'
import { langCodes } from '../div/langcodes.js';
import MainSearch from './MainSearch.js';

const SiteHeader = (props) => {
  const handleChange = e => {props.setLang({value:e.target.value, label:e.target.label});}
  return (
    <div>
      <Container className = "flexbox-container">
        <Navbar style = {{backgroundColor: '#dedbdb', paddingBottom: 5,paddingTop: 5,}}>{/*https://retool.com/blog/building-a-react-navbar/ */}
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/"}><button className="homeBtn">{labels.homeBtn}</button></Link>
            <MainSearch/>
            <Link to = {"/search"} style={{paddingLeft: "1rem",paddingRight: "1rem"}}><button className="detailedSearchBtn">{labels.detailedSearchBtn}</button></Link>
            {/*<Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/import"}><button className="importBtn">{labels.importDataBtn}</button></Link>*/}
              {/*<AddNew label = "+"/>*/}
            {/*<Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/admin"}><button className="adminBtn">{labels.adminBtn}</button></Link>*/}
            <Link style={{paddingLeft: "1rem",paddingRight: "1rem"}} to = {"/lists"}><button className="listsBtn">Lists</button></Link>
            <select value = {props.lang.value} label={props.lang.value} onChange = {handleChange}>
                {langCodes.map((option) => (<option key = {option.value+option.label} value = {option.value}>{option.label}</option>) )}
            </select>
            {/*<LoginWindow/>*/}
        </Navbar>
      </Container>
    </div>
  )
}
export default SiteHeader;