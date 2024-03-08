import React from "react";
import CommentsInput from "./CommentsInput";
import { postUpdateComment } from "../apiEffects";

const EditComment = ({comment_id, comment, setComment, setEdit, user_id, hash}) => {
    const editComment = () => {postUpdateComment({comment, comment_id, delete:null, user_id, hash}).then(() => setEdit(false))}
    return (
    <div className="edit-comment-container">
        <CommentsInput value={comment} setValue={setComment}/>
        <button className="submit-comment-btn" onClick={() => editComment()}>Submit Edits</button>
    </div>)
}
export default EditComment;