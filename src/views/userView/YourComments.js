import React,{useState} from "react";
const parse = require('html-react-parser');
const CommentsElement = props => {
    const {comment_content, comment_type, comment_type_id, comment_created_at, author_id, list_name} = props.element
    const url = {text:`/author/${author_id}/text/${comment_type_id}`, author: `/author/${comment_type_id}`, list:`/lists/all/${comment_type_id}_${list_name}`}
    return (<div className="watchlist-element-container"><p><a href={url[comment_type]}>{`#${props.index+1} `}</a></p>{parse(comment_content)} <p>{`(${comment_created_at})`}</p></div>)
}
const YourComments = props => {
    const [data, setData] = useState(props.data)
    return (<div className="header-container">{data.map((e,index) => <CommentsElement element={e} index={index}/>)}</div>)
}
export default YourComments;