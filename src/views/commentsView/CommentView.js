import React,{useState, useEffect} from "react";
import { getComments } from "../apiEffects";
import CommentsList from "./CommentsList";

const CommentView = (props) => {
    const {comment_type, comment_type_id, userData} = props
    const [comments, setComments] = useState([]);
    useEffect(() => {getComments(comment_type, comment_type_id, setComments)},[])
    return (
    <div className="comment-view-container">
        {comments.length>0&&<p>{`Displaying ${comments.length} comment${comments.length>1?'s':""}`}</p>}
        {comments.length>0&&<CommentsList comments={comments} userData={userData} type={comment_type} type_id={comment_type_id}/>}
    </div>
    )
}
export default CommentView
