import React from "react";
import { createCommentUrl, transformDate } from "../commonFuncs";
const parse = require('html-react-parser');
const CommentsElement = props => {
    const {comment_content, comment_type, comment_created_at,comment_label, commented_comment} = props.element
    const url = createCommentUrl(props.element)
    return (<div className="watchlist-element-container">
                <p>{`#${props.index+1} `}</p>
                <div className="comment-content">
                <p className="commented-element"><a href={url}>{`${comment_type.slice(0,1).toUpperCase()+comment_type.slice(1,comment_type.length)}: ${comment_label}`}</a></p>
                {commented_comment&&<p className="commented-comment">{parse(commented_comment)}</p>}
                {parse(comment_content)}
                </div>
            <p className="comment-created-date">{transformDate(comment_created_at)}</p>
        </div>)
}
const YourComments = props => {
    return (props.data&&<div className="header-container">{props.data.map((e,index) => <CommentsElement element={e} index={index}/>)}</div>)
}
export default YourComments;