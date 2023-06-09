import {Link} from 'react-router-dom'
import React from 'react';
import { Navbar, Container } from "react-bootstrap";
import labels from './labels.js'
import { langCodes } from '../div/langcodes.js';
import MainSearch from './searchView/MainSearch.js';

const SiteHeader = (props) => {
  const handleChange = e => {props.setLang({value:e.target.value, label:e.target.label});}
  const {userData} = props;
  return (
    <Container className = "flexbox-container">
      <Navbar style = {{paddingBottom: 5,paddingTop: 5,}}>{/*https://retool.com/blog/building-a-react-navbar/ */}
          <Link className="header-btn" to="/"><button>{labels.homeBtn}</button></Link>
          <MainSearch/>
          <Link className="header-btn" to ="/lists"><button>Lists</button></Link>
          {(userData!==false)
            ?<Link className="header-btn" to={`/user/show/${userData.user_id+"_"+userData.user_name}`}><button>{userData.user_name.slice(0,1).toUpperCase()}</button></Link>
            :<Link className="header-btn" to="/login"><button>Login</button></Link>}
          <select value = {props.lang.value} label={props.lang.value} onChange = {handleChange}>
              {langCodes.map((option) => (<option key = {option.value+option.label} value = {option.value}>{option.label}</option>) )}
          </select>
      </Navbar>
    </Container>
  )
}
export default SiteHeader;