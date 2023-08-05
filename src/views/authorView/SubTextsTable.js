import { useState } from "react"
import TableRow from '../ViewRow.js';
import labels from '../labels.js';
import ArchiveList from './ArchiveList.js';
import {transformYear, dateCoalesce} from '../formattingFuncs.js';

const SubTextsTable = (props) => {
    const {bookLabel, text_id,bookdesc, titleLabel, typeLabel, genreLabel, formLabel, publYear,languageLabel
        ,dopYear, inceptionYear, metreLabel, book, publisherLabel, lengthLabel, image} = props.data
    const {author_name} = props.author
    const bookLabelReform = bookLabel.split(" | ").length>1?bookLabel.split(" | ").pop():bookLabel
    const [detailed, setDetailed] = useState(false);
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    const rows = [{label:labels.original_title,content:titleLabel},{label:labels.written_date,content:transformYear(selectedDate)}
                ,{label:labels.language,content:languageLabel},{label:labels.genre,content:genreLabel},{label:labels.type, content:typeLabel}
                ,{label:labels.form, content:formLabel},{label:labels.metre,content:metreLabel}
            ,{label:labels.length, content:lengthLabel&&lengthLabel+ " pages"},{label:labels.publishers,content:publisherLabel}
            ,{label:labels.wiki, content:<a href={book}>{book&&book.replace("http://www.wikidata.org/entity/","")}</a>}]
    return (
        <div className="text-info">
            <div className="textBox">
                {image && !image.split("| ")[0].includes("djvu") &&<img src={image.split("| ")[0]} className="textImg" alt="img" />}
                <div className="textInfo">
                    <a className="text-row" onClick = {() => {props.handleClick(text_id&&text_id);!text_id&&setDetailed(!detailed)}}>
                        {bookLabelReform}{selectedDate&&" ("+transformYear(dateCoalesce(publYear, dopYear, inceptionYear))+ ")"}
                    </a>
                    <p className="text-row-sub">{bookdesc}</p>
                </div>
            </div>           
                {detailed&&<div className="text-row-detailed">
                    {rows.map((row) => (row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>))}
                    <ArchiveList info={{bookLabel:bookLabelReform, authorLabel:author_name, titleLabel}}/>
                    </div>}
        </div>)
}

export default SubTextsTable;