import React, {useState, useEffect} from 'react';
import { countries } from '../../div/countries';
import { languages } from '../../div/languages';
import { fetchList } from '../apiEffects';
import DropdownMenu from './DropdownMenu';

const AuthorsByBooksTable = ({type}) => {
    const [filters, setFilters] = useState({"country":"All", "language":"All"});
    const [data, setData] = useState();
    const country = filters.country==="All"?"":" from " + filters.country
    const language = filters.language==="All"?"":" using " + filters.language
    useEffect(() => {if(filters.country!=="All"||filters.language!=="All") {fetchList({setData, filters, type})()} else{setData(null)}},[filters])
    return (
        <><div className="dropdowns-container">
            <DropdownMenu options = {countries} name = {"country"} setFilters={setFilters} filters = {filters}/>
            <DropdownMenu options = {languages} name = {"language"} setFilters={setFilters} filters = {filters}/>
            <button className="homeBtn" onClick={() => {setData(null)}}>Clear Search</button>
        </div>
        {data&&<div>
            {type!=="no_books"&&<p>{`There are ${data.length} authors${country}${language} with a total of ${data.reduce((acc, cur)=>acc+cur.texts,0)} texts`}</p>}
            <table id="listTable"><tbody>
                <tr><th>Author</th><th>Occupations</th><th>Nationality</th><th>Language</th>{type!=="no_books"&&<th>#Texts</th>}</tr>
                {data.sort((a,b)=>b.texts-a.texts).slice(0,1000).map(result => (
                    <tr key={result.author_id} className="table-row">
                        <td className="popup-row"><a href={`/author/${result.author_id}`}>{result.label}</a></td>
                        <td>{result.author_positions}</td><td>{result.nationality}</td><td>{result.language}</td>{result.texts&&<td>{result.texts}</td>}
                    </tr>
                ))}
            </tbody></table>
        </div>}</>
    )
}

export default AuthorsByBooksTable;