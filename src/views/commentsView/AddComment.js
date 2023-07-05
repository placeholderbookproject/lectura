import React,{useState} from "react";
import CommentsInput from "./CommentsInput";
import { postComment } from "../apiEffects";
const AddComment = props => {
    const {user_id, parent_comment_id, type, type_id} = props
    const baseValue = ""//"Add and format your comment here"
    const [comment, setComment] = useState(baseValue)
    const [addComment, setAddComment] = useState(false);
    const uploadComment = () => {
        const body = {comment,user_id, parent_comment_id:parent_comment_id?parent_comment_id:null, type, type_id}
        postComment(body).then(() => {setAddComment(false);setComment(baseValue)})
        //insert Post request here.then(() => {setAddComment(false);setValue(baseValue);getAllComments(list, list_id)}) 
    }
    return (
    <div className="add-comment">
        <button className="add-comment-btn" onClick={() => {setAddComment(!addComment)}}>
            {`${addComment?"Cancel Comment":"Add a Comment"}`}
        </button>
        {addComment&&<CommentsInput value={comment} setValue={setComment}/>}
        {addComment&&<button className="submit-comment-btn" onClick={uploadComment}>Submit Comment</button>}
    </div>)
}
export default AddComment;