import labels from './labels.js';
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {fetchDataEffect} from './apiEffects.js'
import { AuthorPopup } from './Lists.js';

export const IntroPage = (props) => {
    return (
        <>
            <LatestChanges/>
        </>
    )
}

export const LatestChanges = () => {
    const [data, setData] = useState();
    useEffect (fetchDataEffect({setData}),[])
    const types = ["authors", "texts"]
    return (
        <div className = "latestAdditions">
            {data?<header className="latestAdditionsHeader">{labels.latestAdditions}</header>:<></>}
            {data?types.map((type) => 
                <div className="latestAdditionsList" key = {type}>
                    <ul className="listHeader">{type.charAt(0).toUpperCase()+type.slice(1,type.length)}</ul>
                    {data[type].map((element) => 
                        <AuthorPopup key={element["label"]} author={type==="authors"&&element["author_id"]}>
                            <Link to = {type==="authors"?"/author/"+element["author_id"]:"/text/"+element["text_id"]} key = {element["label"]}>
                                <li className="listRow">{element["label"]}</li>
                            </Link>
                        </AuthorPopup>
                    )}
                </div>)
            :<></>
            }
        </div>
        )
}