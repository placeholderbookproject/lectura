import React from "react";
const parse = require('html-react-parser');
const CommentsElement = props => {
    const {comment_content, comment_type, comment_type_id, comment_created_at,comment_label, commented_comment, author_id, list_name} = props.element
    const url = {text:`/author/${author_id}/text/${comment_type_id}`, author: `/author/${comment_type_id}`, list:`/lists/all/${comment_type_id}_${list_name}`}
    return (<div className="watchlist-element-container">
            <p><a href={url[comment_type]}>{`#${props.index+1} `}</a></p>
                <div className="comment-content"><p className="commented-element">{`${comment_type.slice(0,1).toUpperCase()+comment_type.slice(1,comment_type.length)}: ${comment_label}`}</p>
                    {commented_comment&&<p className="commented-comment">{parse(commented_comment)}</p>}
                    {parse(comment_content)}
                </div>
            <p className="comment-created-date">{ `(${comment_created_at})`}</p>
        </div>)
}
const YourComments = props => {
    return (props.data&&<div className="header-container">{props.data.map((e,index) => <CommentsElement element={e} index={index}/>)}</div>)
}
export default YourComments;