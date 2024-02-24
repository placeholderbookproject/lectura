import React, {useState, useEffect} from 'react';
import { archiveEffect, googleEffect, fetchSourceData } from '../apiEffects';
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

const BNF = props => {
    const {creator, date, language, publisher, source, title, identifier} = props.data
    const label = `${title} by ${creator} (${date}) (${language}) (${publisher}) (${source})`
    const link = identifier.split("|")[0]
    return (<p key={link} className="source-result"><a href={link} className="archiveRow">{label}</a></p>)
}

const SourceList = props => {
    const {func, source, info, Component, type} = props
    const [data, setData] = useState();
    const [showAll, setShowAll] = useState(false)
    const [showData, setShowData] = useState(false)
    useEffect(()=> func({data:info, setData, type}),[info])
    return (<div className="source">
        {data&&data.length>0&&<p onClick={()=>setShowData(!showData)} className="source-header"><span style={{fontWeight:600}}>{source}</span></p>}
        {showData&&
            <>{data.slice(0,showAll?data.length:5).map((result)=>Component&&<Component data={result}/>)}
                {data.length>5&&<h4 onClick={() => setShowAll(!showAll)}>{`${showAll?'Show top 5':'Show remaining results'}`}</h4>}</>}
    </div>
    )
}
const TextSources = props => {
    const sources = [{name:"Archive.org", func:archiveEffect, component: ArchiveResult }
                    ,{name:"Google Books", func:googleEffect, component:GoogleResult}
                    ,{name:"BNF", func:fetchSourceData, component:BNF, type:"bnf"}]
    const [data, setData] = useState({})
    useEffect(()=>{if(props.text!==undefined){setData(props.text)}},[props.text])    
    return (<>
    {data.text_q&&<WikiExternalsLabels q_number={data.text_q} language={props.lang.value}/>}
    {Object.keys(data).length>0&&<div className="source-container">
        {sources.map(source => <SourceList info={data} func={source.func} source={source.name} Component={source.component} type={source.type}/>)}
    </div>}</>)
}

export default TextSources