import React, {useState} from 'react';
import TextField from "@mui/material/TextField";

function SearchDetailed(props) {//Add the table view of
    const data = props.data;
    const [searchType, setSearchType] = useState("Author"); 
    //var search = props.search;
    //var data = props.data;
    //List of options with label and options from these options
    //search field + clickable dropdown of variables to search through
    function changeVersion () {
        if(searchType === "Author"){setSearchType("Work")}
        else {setSearchType("Author")}
    }
    return (
      <div className = "detailedSearch">
        <>
          <TextField/>
          <button onClick={changeVersion}>Click to change search to '{+ (searchType === "authors")? "works'":"authors'"}</button>
        </>
        <>
          <table>
          <tbody>
            <tr>
              <td>{searchType}</td>{/*Add mapping for remaining rows based on selection -> search by these criteria
              https://medium.com/geekculture/creating-multi-select-dropdown-with-checkbox-in-react-792ff2464ef3*/}
            </tr>
          </tbody>
          </table>
        </>
      </div>
    )
  }

export default SearchDetailed;