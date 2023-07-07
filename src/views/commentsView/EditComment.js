import React from "react";
import CommentsInput from "./CommentsInput";
import { postUpdateComment } from "../apiEffects";

const EditComment = props => {
    const {comment_id, comment, setComment, setEdit} = props
    const editComment = () => {postUpdateComment({comment, comment_id, delete:null}).then(() => setEdit(false))}
    return (
    <div className="edit-comment-container">
        <CommentsInput value={comment} setValue={setComment}/>
        <button className="submit-comment-btn" onClick={() => editComment()}>Submit Edits</button>
    </div>)
}
export default EditComment;