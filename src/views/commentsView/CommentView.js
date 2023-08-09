import React from "react";
import CommentsList from "./CommentsList";
import CommentsSort from "./CommentsSort";
import "./comments.css";

const CommentView = (props) => {
    const {comment_type, comment_type_id, userData, comments, setComments} = props.properties
    const handleSortChange = (sortedComments) => {setComments(sortedComments);};
    return (
    <div className="comment-view-container">
        <div className="comment-view-header">
            {comments.length>0&&<>
                <p>{`Displaying ${comments.length} comment${comments.length>1?'s':""}`}</p>
                <CommentsSort comments={comments} onSortChange={handleSortChange}/>
            </>}
        </div>
        {comments.length>0&&<CommentsList comments={comments} userData={userData} type={comment_type} type_id={comment_type_id}/>}
    </div>
    )
}
export default CommentView
