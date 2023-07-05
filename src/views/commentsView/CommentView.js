import React,{useState, useEffect} from "react";
import { getComments } from "../apiEffects";
import Comment from "./Comment";

const CommentView = (props) => {
    const {comment_type, comment_type_id, userData} = props
    const [comments, setComments] = useState([]);
    useEffect(() => {getComments(comment_type, comment_type_id, setComments)},[])
    return (
    <div>
        <p>{`Displaying ${comments.length>0?comments.length:""} comment${comments.length>1?'s':""}`}</p>
        {comments.length>0&&comments.map((comment)=><Comment data={comment} userData={userData} type={comment_type} type_id={comment_type_id} />)}
    </div>
    )
}
export default CommentView
