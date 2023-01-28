import React from 'react';
import TextField from "@mui/material/TextField";

function SearchDetailed(props) {//Add the table view of 
    //var search = props.search;
    //var data = props.data;
    //List of options with label and options from these options
    //search field + clickable dropdown of variables to search through
    return (
      <div>
        <div>
          <TextField/>
          <button>{"placeholder for filter options"/*should be changed to dynamic select list*/}</button>
        </div>
        <div>
          <table>
          <tbody>
            <tr>
              <td>Author/Title</td>
              <td>Type</td>
              </tr>
          </tbody>
          </table>
        </div>
      </div>
    )
  }

export default SearchDetailed;