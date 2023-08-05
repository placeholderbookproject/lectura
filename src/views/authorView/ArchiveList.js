import React, {useState, useEffect} from 'react';
import { archiveEffect } from '../apiEffects';

const ArchiveResult = props => {
    const {identifier, title, creator, year, downloads, language, mediatype} = props.data
    const link = {value:`https://archive.org/details/${identifier}`,label:`${title} by ${creator} (${year}) (${downloads} downloads) (${language}) (${mediatype})`}
    return (<p key={identifier} className="source-result"><a href={link.value} className="archiveRow">{link.label}</a></p>)
}

const ArchiveList = (props) => {
    const {bookLabel, authorLabel, titleLabel} = props.info
    const [archive, setArchive] = useState();
    const [showArchive, setShowArchive] = useState(false)
    useEffect(() => {archiveEffect({title:bookLabel.split(", "[0]), name:authorLabel, setArchive, originalTitle:titleLabel})();},[props.info])
    return (bookLabel&&
    <div>
        {archive&&archive.length>0&&<p onClick={()=>setShowArchive(!showArchive)}><span style={{fontWeight:600}}>Archive.org</span></p>}
        {showArchive&&archive.slice(0,5).map((result)=><ArchiveResult data={result}/>)}
    </div>
)}

export default ArchiveList