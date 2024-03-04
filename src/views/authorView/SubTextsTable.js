import { useState } from "react"
import TableRow from '../ViewRow.js';
import ArchiveList from './TextSources.js';
import {transformYear, dateCoalesce} from '../formattingFuncs.js';
import { subTextRows,elementInteractions } from "./dataRows.js";
import ElementInteraction from "../ElementInteraction.js";
import { postTextInteraction } from "../apiEffects.js";
const SubTextsTable = ({data, author, handleClick, userData, setUserData}) => {
    const {bookLabel, text_id, titleLabel, publYear,dopYear, inceptionYear, image} = data
    const bookLabelReform = bookLabel && bookLabel.split(" | ").length>1?bookLabel.split(" | ").pop():bookLabel
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        <div className="text-info">
            <div className="textBox">
                {image && !image.split("| ")[0].includes("djvu") &&<img src={image.split("| ")[0]} className="textImg" alt="img" />}
                <div className="textInfo">
                    <p className="text-row">
                        <button className="author-text-row-btn" onClick = {() => {handleClick(text_id&&text_id);!text_id&&setDetailed(!detailed)}}>
                            {bookLabelReform}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}
                        </button>
                        {text_id&&elementInteractions.map((e) => <ElementInteraction values={{...e, condition:data[e.name], user_id:userData.user_id, 
                                    hash:userData.hash,id:text_id,userData,setUserData, postFunction:postTextInteraction}}/>)}
                    </p>
                </div>
            </div>           
                {detailed&&<div className="text-row-detailed">
                    {subTextRows(data).map((row) => (row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>))}
                    <ArchiveList info={{bookLabel:bookLabelReform, authorLabel:author.author_name, titleLabel}}/>
                    </div>}
        </div>)
}

export default SubTextsTable;