import React,{useState} from "react";
import { WatchListTextElement } from "./UserElementInteractionsList";
import { postTextInteraction } from "../apiEffects";
import UserElementSearch from "./UserElementSearch";
import Sort,{sortList} from "../Sorting";
import Filters from "../Filter";
import { getUniquePropertyValues } from "../formattingFuncs";
const CheckList = props => {
    const sortOptions = [{value:'bookLabel', label:'Title'}, {value:'check_date', label: 'Check Date'}, {value:'origincountryLabel', label: 'Country'}]
    const [data, setData] = useState(props.data)
    const [sortKey, setSortKey] = useState({ keys: ['bookLabel', 'check_date', 'origincountryLabel'] });
    const filterOptions = data && [{label: 'Language', property: 'languageLabel', values: getUniquePropertyValues(data, 'languageLabel') },
                                    {label: 'Genre', property: 'genreLabel', values: getUniquePropertyValues(data, 'genreLabel') },];
    const removeElement = (text_id) => {
        const updatedData = data.filter(item => item["text_id"] !== text_id);
        setData({...updatedData});
        postTextInteraction({condition: false, user_id: props.userData.user_id, id:text_id, type:"checks", hash:props.userData.hash});}   
    return (props.data&&props.data.length>0&&
    <div>
        <div className="checklist-header"><UserElementSearch originData={props.data} setData={setData}/>
        <select value={sortKey[0]} onChange={(e) => setSortKey({...sortKey,keys:[e.target.value]})}>
            {sortOptions.map((key) => (<option key={key.value} value={key.value}>{key.label}</option>))}
        </select>
        <Sort sortKey={sortKey} setSortKey={setSortKey}/>
        <Filters texts={data} setTexts={setData} filterOptions = {filterOptions} originTexts = {props.data}/>
        </div>
        {sortList(data,sortKey.keys, sortKey.descending).map((e, index) => 
        <div className="watchlist-element-container" key={e.text_id}>
            <WatchListTextElement element={e} data={data} setData={setData} userData={props.userData} index={index}/>
            <button className="check-btn-active" onClick={()=>removeElement(e.text_id)}></button>
        </div>)}
    </div>
        )
}
export default CheckList;