import labels from './labels.js';
import {Link} from 'react-router-dom';

const convertData = (data, n) => {
    const listLength = n
    const keys = Object.keys(data)
    for (const key in keys) {
        const element = keys[key]
        data[element] = data[element].length>listLength?data[element].slice(0,listLength):data[element]
    }
    return data
}

export const IntroPage = (props) => {
    const {data} = props
    return (
        <>
            <LatestChanges data = {data}/>
        </>
    )
}

export const LatestChanges = props => {
    let data = convertData(props.data, 5)
    const types = ["authors", "texts"]
    return (
        <div className = "latestAdditions">
        <header className="latestAdditionsHeader">{labels.latestAdditions}</header>
            {types.map((type) => 
            <div className="latestAdditionsList" key = {type}>
                <ul className="listHeader">{type.charAt(0).toUpperCase()+type.slice(1,type.length)}</ul>
                {data[type].map((element) => 
                    <Link to = {type==="authors"?"/author/"+element["author_id"]:"/text/"+element["text_id"]} key = {element["label"]}>
                        <li className="listRow">{element["label"]}</li>
                    </Link>
                )}
            </div>)
            }
        </div>
        )
}