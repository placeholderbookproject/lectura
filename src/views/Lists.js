import React, {useState, useEffect} from 'react';
import { countries } from '../div/countries';
import { languages } from '../div/languages';
//import Popup from './AddNew';
import { fetchList } from './apiEffects';
import ComponentPopup from './Popup';

const ListsTable = (props) => {
    const [filters, setFilters] = useState({"country":"All", "language":"All"});
    const [data, setData] = useState();
    const country = filters.country==="All"?"":" from " + filters.country
    const language = filters.language==="All"?"":" using " + filters.language
    useEffect(() => {
        if(filters.country!=="All"||filters.language!=="All") {fetchList({setData, filters})()}
        else{setData(null)}
    },[filters])
    return (
        <>
        <div className="dropdowns-container">
            <DropdownMenu options = {countries} name = {"country"} setFilters={setFilters} filters = {filters}/>
            <DropdownMenu options = {languages} name = {"language"} setFilters={setFilters} filters = {filters}/>
            <button className="homeBtn" onClick={() => {setData(null)}}>Clear Search</button>
        </div>
        <div>
            {data&&<>
                <p>{`There are ${data.length} authors${country}${language} with a total of ${data.reduce((acc, cur)=>acc+cur.texts,0)} texts`}</p>
                <table id="listTable"><tbody>
                    <tr><th>Author</th><th>Occupations</th><th>Nationality</th><th>Language</th><th>#Texts</th></tr>
                    {data.sort((a,b)=>b.texts-a.texts).map(result => (
                        <tr key={result.author_id}>
                            <td>
                                <ComponentPopup id={result.author_id} key={result.author_id} lang={props.lang} type="author">
                                    {result.label}
                                </ComponentPopup>
                            </td>
                            <td>{result.author_positions}</td>
                            <td>{result.nationality}</td><td>{result.language}</td><td>{result.texts}</td>
                        </tr>
                    ))}
                </tbody></table>
                </>
            }
        </div>
        </>
    )
}

export const DropdownMenu = props => {
    const [selected, setSelected] = useState("all");
    const {name, options, setFilters, filters} = props;
    const handleChange = e => {
        setSelected(e.target.value)
        const newFilters = {...filters, [name]:e.target.value}
        setFilters(newFilters)
    }
    return (
        <div className="dropdown">
            <label className="dropdown-label">{`Select a ${name}`}</label>
            <select  value = {selected} onChange = {handleChange}>
                {options.map((option) => (<option key = {option} value = {option}>{option}</option>) )}
            </select>
        </div>
    )
}

export default ListsTable;