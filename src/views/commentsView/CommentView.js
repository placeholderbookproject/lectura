import React,{useState, useEffect} from "react";
import { getComments } from "../apiEffects";
import CommentsList from "./CommentsList";
import CommentsSort from "./CommentsSort";
import "./comments.css";

const CommentView = (props) => {
    const {comment_type, comment_type_id, userData} = props
    const user_id = userData&&userData.user_id
    const [comments, setComments] = useState([]);
    useEffect(() => {getComments(comment_type, comment_type_id, user_id, setComments)},[])
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
