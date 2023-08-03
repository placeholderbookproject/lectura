import labels from './labels.js';
import {useState, useEffect} from 'react';
import {fetchDataEffect} from './apiEffects.js'
import ComponentPopup from './Popup.js';

export const IntroPage = (props) => {return (<LatestChanges lang = {props.lang}/>)}
export const LatestChanges = (props) => {
    const [data, setData] = useState();
    useEffect(fetchDataEffect({setData}),[])
    const types = ["authors", "texts"]
    return (
        <div className = "latestAdditions">
            {data&&<header className="latestAdditionsHeader">{labels.latestAdditions}</header>}
            {data&&types.map((type) => 
                <div className="latestAdditionsList" key = {type}>
                    <ul className="listHeader">{type.charAt(0).toUpperCase()+type.slice(1,type.length)}</ul>
                    {data[type].map((element) => 
                        <ComponentPopup key={element["label"]} id={type==="authors"?element["author_id"]:element["text_id"]} 
                            lang={props.lang} type={type.replace("s","")}>
                            <li className="listRow">{element["label"]}</li>
                        </ComponentPopup>
                    )}
                </div>)}
        </div>
    )
}