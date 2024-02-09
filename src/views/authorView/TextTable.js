import TableRow from '../ViewRow.js'
import labels from '../labels.js'
import {useState, useEffect} from 'react';
import { textRows } from './dataRows.js';

const TextTable = (props) => {
    const [text, setText] = useState(props.properties.text)
    useEffect(()=>setText(props.properties.text),[props.properties.text])
    const {image, titleLabel} = text
    const title = text&&text.text_title?text.text_title.split(","):"";
    return (
        <div id = "textTableWindow" className="person-info">
            {titleLabel!==title[0]&&<TableRow label={labels.original_title}>{titleLabel}</TableRow>}
            {image && !image.split(", ")[0].includes("djvu")&&<img src={image.split(", "[0])} className="text-img" alt="img"/>}
            {text&&<>{textRows(text).map((row) => row.content&&<TableRow label={row.label} key={row.content+row.label}>{row.content}</TableRow>)}
            </>}
        </div>
    )
  }

export default TextTable;