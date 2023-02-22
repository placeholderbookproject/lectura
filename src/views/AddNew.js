import React, { useState, useEffect } from 'react';
import {EditWindow, TextEdit, InputWithLabel, SearchResults, AuthorEdit} from './EditWindow.js';
import {editRowAll} from './filters.js';
import labels from './labels.js';
import TableRow from './ViewRow.js';

export const Popup = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {setIsOpen(!isOpen);}
  return (
    <div>
      <button className = "addNewBtn" onClick={togglePopup}>{props.label}</button>
      {isOpen &&
        <div className="popup-container">
          <div className="popup-content">
              <button onClick={togglePopup}>X</button>
            {props.children}
          </div>
        </div>
      }
    </div>
  );
}

const AddText = props => {
    const {cols, data, setData, type} = props
    useEffect(() => {data["text_title"]!==undefined?setData({...data, "text_title":""}):void(0)},[])
    return (
        <>
            <TableRow label = {labels.original_title + " "}>
                <div style = {{display:'inline-flex'}}>
                    <InputWithLabel editData = {data} setEditData = {setData} data = {data} setData = {setData} type = {type}
                        label = "original title" value = {data["text_title"]} name = "text_title"/>
                    <SearchResults type = "texts" query = {data["text_title"]!==undefined?data["text_title"]:""}/>
                </div>
            </TableRow>
                <TextEdit cols = {cols} data = {data} origData = {data} setData = {setData} type = {type} id = {null} />
        </>
    )
}

const AddAuthor = props => {
    const {cols, data, setData, type} = props
    useEffect(() => {data["author_name"]!==undefined?setData({...data, "author_name":""}):void(0)},[])
    return (
        <>
            <TableRow label = {labels.author_name + " "}>
                <div style = {{display:'inline-flex'}}>
                    <InputWithLabel editData = {data} setEditData = {setData} data = {data} setData = {setData} type = {type}
                        label = "author name" value = {data["author_name"]} name = "author_name"/>
                    <SearchResults type = "authors" query = {data["author_name"]!==undefined?data["author_name"]:""}/>
                </div>
            </TableRow>
                <AuthorEdit cols = {cols} data = {data} setData = {setData} origData = {data} type = {type} id = {null}
                />
        </>
    )
}

export const AddNew = props => {
    const [cols,setCols] = useState([]);//editRowAll["texts"]
    const [data, setData] = useState({});
    const [type, setType] = useState("");
    return (
        <>
            <Popup label = {props.label}>
                <table><tbody>
                    <tr><td>
                    <p>{labels.import_add_new}</p>
                    <button onClick = {() => {setCols(editRowAll["authors"]);setType("authors");}}>{labels.author}</button>
                    <button onClick = {() => {setCols(editRowAll["texts"]);setType("texts");}}>Text</button>
                    </td></tr>
                    {cols.length>0&&
                        (type==="texts")?
                        <AddText cols = {cols} data = {data} setData = {setData} type = {type} />
                        :type==="authors"
                            ?<AddAuthor cols = {cols} data = {data} setData = {setData} type = {type}/>
                            :<></>}
                        {/*<EditWindow cols = {cols} data = {data} setData = {setData} origData = {data} type = {type} id = {null} />}*/}
               </tbody></table>
            </Popup>
        </>
    )
}



export default Popup;
