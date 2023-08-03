import React from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@material-ui/icons/Clear';
const ListsSearch = props => {
    const {searchType, setSearchType, setQuery, query} = props
    const searchOptions = ["all","authors","texts"]
    const clickRadio = (option) => {setSearchType(option);}
    return (<>
        <div className="list-search-bar">
            <input type="text" placeholder="Search for a list" value={query} onChange={(e)=>setQuery(e.target.value)} className="search-input"/>
            <IconButton onClick={() => setQuery("")} aria-label="Clear Search Button" edge="end"><ClearIcon style={{paddingRight:5}}/></IconButton>
        </div>
        <div>
        <fieldset className="list-search-type">{searchOptions.map((option) => 
                <><input type = "radio" id={option} name="search-type" key={option} onClick={()=>clickRadio(option)} 
                        checked={option===searchType} onChange={() => clickRadio(option)}/>
                    <label>{option.charAt(0).toUpperCase()+option.slice(1)}</label>
                </>)}
            </fieldset>
        </div>
        </>)
}
export default ListsSearch;