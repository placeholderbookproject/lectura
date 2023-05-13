import React, {useState, useEffect} from 'react';
import { archiveEffect } from './apiEffects';

const ArchiveList = (props) => {
    const [archive, setArchive] = useState();
    const [showArchive, setShowArchive] = useState(false)
    const {title, name, originalTitle} = props
    useEffect(() => {archiveEffect({title:title.split(", "[0]), name, setArchive, originalTitle})();},[title, name, originalTitle])
    return (
    <div>
        {archive&&archive.length>0&&
            <p onClick = {() => setShowArchive(!showArchive)}><span style={{fontWeight:600}}>Archive.org Results</span></p>}
        {showArchive&&
            archive.map((result) =>
                <p key={result.identifier}>
                    <a href={'https://archive.org/details/'+result.identifier}>
                {`${result.title} by ${result.creator} (${result.year}) (
                    ${result.downloads} downloads) (${result.language}) (${result.mediatype})`}
                    </a>
                </p>)}
    </div>
)}

export default ArchiveList