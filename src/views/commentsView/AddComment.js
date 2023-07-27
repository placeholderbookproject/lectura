import React,{useState} from "react";
import CommentsInput from "./CommentsInput";
import { postComment } from "../apiEffects";
const AddComment = props => {
    const {user_id, hash,parent_comment_id, type, type_id, buttonName} = props
    const baseValue = ""//"Add and format your comment here"
    const [comment, setComment] = useState(baseValue)
    const [addComment, setAddComment] = useState(false);
    const uploadComment = () => {
        const body = {comment,user_id, hash,parent_comment_id:parent_comment_id?parent_comment_id:null, type, type_id}
        postComment(body).then(() => {setAddComment(false);setComment(baseValue)})
    }
    return (
    <div className="add-comment">
        <button className="add-comment-btn" onClick={() => {setAddComment(!addComment)}}>
            &#128172; {buttonName}
        </button>
        {addComment&&<CommentsInput value={comment} setValue={setComment}/>}
        {addComment&&<button className="submit-comment-btn" onClick={uploadComment}>Submit</button>}
    </div>)
}
export default AddComment;