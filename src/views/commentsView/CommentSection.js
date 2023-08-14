import React,{useState, useEffect} from "react";
import { getComments } from "../apiEffects";
import AddComment from "./AddComment";
import CommentView from "./CommentView";

const CommentSection = props => {
    const {userData, type, type_id, buttonName} = props.properties;
    const {user_id, hash} = userData;
    const [comments, setComments] = useState([]);
    useEffect(() => {getComments(type, type_id, user_id, setComments)},[type_id])
    return (
    <div className="comment-section">
        {userData&&<AddComment properties={{user_id, type, type_id, hash, buttonName}} />}
        <CommentView properties = {{comment_type:type, comment_type_id:type_id, userData, comments, setComments}}/>
    </div>)
}
export default CommentSection