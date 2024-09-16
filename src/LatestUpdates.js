import React,{useState, useEffect} from "react";
import { fetchUserUpdates } from "./views/apiEffects";

const LatestUpdates = ({user_id}) => {
    const [data,setData] = useState([]);
    const [update, setUpdate] = useState(10);
    useEffect(() => {fetchUserUpdates(user_id, setData, update)},[update])
    return (data&&
    <div className="latest-updates-div">
        <header className="latestAdditionsHeader">Latest User Updates</header>
        {data.map(i => <UpdateRow data={i}/>)}
        <div className="update-interactions-div">
            <button className="update-btn" onClick={() => setUpdate(update+10)}>Show 10 more</button>
            {update>10?<button className="update-btn" onClick={() => setUpdate(update-10)}>Show 10 less</button>:<></>}
        </div>
    </div>)
}

const UpdateRow = ({data}) => {
    const {user_name, user_id, type, text_id, author_name, author_id,text_title, date_diff} = data
    const prof_url = `/user/show/${user_id}_${user_name}`
    const cont_url = `${text_id===null?'/author/'+author_id:'/author/'+author_id+'/text/'+text_id}`
    const title = `${text_id===null?author_name:text_title}`
    return (<p className="update-row"><a href={prof_url}>{`${user_name}`}</a>{` ${type} `}<a href={cont_url}>{title}</a>{` (${date_diff})`}</p>)
}
export default LatestUpdates;