import React,{useState} from "react";
import { WatchListTextElement } from "./UserElementInteractionsList";
import { postTextInteraction } from "../apiEffects";
import UserElementSearch from "./UserElementSearch";
const CheckList = props => {
    const [data, setData] = useState(props.data)
    const removeElement = (text_id) => {
        const updatedData = data.filter(item => item["text_id"] !== text_id);
        setData({...updatedData});
        postTextInteraction({condition: false, user_id: props.userData.user_id, id:text_id, type:"checks", hash:props.userData.hash});}   
    return (props.data&&props.data.length>0&&
    <div><UserElementSearch originData={props.data} setData={setData}/>
        {data.map((e, index) => 
        <div className="watchlist-element-container" key={e.text_id}>
            <WatchListTextElement element={e} data={data} setData={setData} userData={props.userData} index={index}/>
            <button className="check-btn-active" onClick={()=>removeElement(e.text_id)}></button>
        </div>)}
    </div>
        )
}
export default CheckList;