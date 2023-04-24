import React, {useState, useEffect} from 'react';
import { countries } from '../div/countries';
import { languages } from '../div/languages';
import { fetchList } from './apiEffects';

const ListsTable = props => {
    const [filters, setFilters] = useState({"country":"All", "language":"All"});
    const [data, setData] = useState();
    const country = filters.country==="All"?"":" from " + filters.country
    const language = filters.language==="All"?"":" using " + filters.language
    useEffect(() => {if(filters.country!=="All"||filters.language!=="All") {fetchList({setData, filters})()}},[country, language])
    return (
        <>
        <div className="dropdowns-container">
            <DropdownMenu options = {countries} name = {"country"} setFilters={setFilters} filters = {filters}/>
            <DropdownMenu options = {languages} name = {"language"} setFilters={setFilters} filters = {filters}/>
            <button onClick = {() => fetchList({setData, filters})()}>Search</button>
        </div>
        <div>
            {data
                ?<>
                <p>{`There are ${data.length} authors${country}${language} with a total of ${data.reduce((acc, cur)=>acc+cur.texts,0)} texts`}</p>
                <table id="listTable"><tbody>
                    <tr><th>Label</th><th>Nationality</th><th>Language</th><th>#Texts</th></tr>
                    {data.sort((a,b)=>b.texts-a.texts).map(result => (
                        <tr key={result.author_id}><td><a href={"/author/"+result.author_id}>{result.label}</a></td>
                            <td>{result.nationality}</td><td>{result.language}</td><td>{result.texts}</td>
                        </tr>
                    ))}
                </tbody></table>
                </>
                :<></>
            }
        </div>
        </>
    )
}

const DropdownMenu = props => {
    const [selected, setSelected] = useState("all");
    const {name, options, setFilters, filters} = props;
    const handleChange = e => {
        setSelected(e.target.value)
        const newFilters = {...filters, [name]:e.target.value}
        setFilters(newFilters)
    }
    return (
        <div className="dropdown">
            <label className="dropdown-label">{`Filter by ${name}`}</label>
            <select  value = {selected} onChange = {handleChange}>
                {options.map((option) => (<option key = {option} value = {option}>{option}</option>) )}
            </select>
        </div>
    )
}

export default ListsTable;