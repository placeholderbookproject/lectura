import React from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@material-ui/icons/Clear';
import { searchSelect } from "../commonFuncs";

const ListsSearch = props => {
    const {searchType, setSearchType, setQuery, query} = props
    const searchOptions = ["all","authors","texts"]
    const clickRadio = (option) => {setSearchType(option);}
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search for a list" value = {query} onChange = {(e) => searchSelect(setQuery,e)} className="search-input"/>
            <IconButton onClick = {() => setQuery("")} aria-label="Clear Search Button" edge="end"><ClearIcon/></IconButton>
            <fieldset className="search-type">{searchOptions.map((option) => 
            <><input type = "radio" id={option} name="search-type" key={option} onClick={()=>clickRadio(option)} checked={option===searchType}
                onChange={() => clickRadio(option)}/>
                <label>{option.charAt(0).toUpperCase()+option.slice(1)}</label>
            </>)}
            </fieldset>
        </div>
    )
}

export default ListsSearch;