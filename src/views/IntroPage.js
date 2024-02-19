import labels from './labels.js';
import {useState, useEffect} from 'react';
import {fetchDataEffect} from './apiEffects.js'

export const IntroPage = (props) => {return (<LatestChanges lang = {props.lang}/>)}
export const LatestChanges = () => {
    const [data, setData] = useState();
    useEffect(() => fetchDataEffect({setData}),[])
    const types = ["authors", "texts"]
    return (
        <div className = "latestAdditions">
            {data&&<header className="latestAdditionsHeader">{labels.latestAdditions}</header>}
            {data&&types.map((type) => 
                <div className="latestAdditionsList" key = {type}>
                    <ul className="listHeader">{type.charAt(0).toUpperCase()+type.slice(1,type.length)}</ul>
                    {data[type].map((element) => 
                        element["author_id"]&&<li className="listRow"><a className="latest-additions-link" href={`/author/${element["author_id"]}${type==="texts"?'/text/'+element["text_id"]:''}`}>{element["label"]}</a></li>
                    )}
                </div>)}
        </div>
    )
}