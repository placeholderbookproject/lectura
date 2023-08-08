import React, {useState, useEffect} from 'react';
import { archiveEffect, googleEffect } from '../apiEffects';
import { WikiExternalsLabels } from '../wikidata';

const ArchiveResult = props => {
    const {identifier, title, creator, year, downloads, language, mediatype} = props.data
    const link = {value:`https://archive.org/details/${identifier}`,label:`${title} by ${creator} (${year}) (${downloads} downloads) (${language}) (${mediatype})`}
    return (<p key={identifier} className="source-result"><a href={link.value} className="archiveRow">{link.label}</a></p>)
}

const GoogleResult = props => {
    const {volumeInfo} = props.data
    const {authors, title, language, publishedDate, canonicalVolumeLink, pageCount} = volumeInfo
    const link = {value:canonicalVolumeLink, label:`${title} by ${authors.join()} (${publishedDate}) (${language}) (${pageCount} pages)`}
    return (<p key={canonicalVolumeLink} className="source-result"><a href={link.value} className="archiveRow">{link.label}</a></p>)
}

const SourceList = props => {
    const {func, source, info, Component} = props
    const [data, setData] = useState();
    const [showData, setShowData] = useState(false)
    useEffect(()=> func({data:info, setData}),[])
    return (<div className="source">
        {data&&data.length>0&&<p onClick={()=>setShowData(!showData)} className="source-header"><span style={{fontWeight:600}}>{source}</span></p>}
        {showData&&data.slice(0,5).map((result)=><Component data={result}/>)}
    </div>
    )
}

const TextSources = props => {
    const sources = [{name:"Archive.org", func:archiveEffect, component: ArchiveResult }
                    ,{name:"Google Books", func:googleEffect, component:GoogleResult}]
    return (<>
    {props.info.text_q&&<WikiExternalsLabels q_number={props.info.text_q} language={props.lang.value}/>}
    <div className="source-container">
        {sources.map(source => <SourceList info={props.info} func={source.func} source={source.name} Component={source.component}/>)}
    </div></>)
}

export default TextSources