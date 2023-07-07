import React,{useState} from "react";
import AddComment from "./AddComment";
import EditComment from "./EditComment";
import { postUpdateComment } from "../apiEffects";
const parse = require('html-react-parser');

const Comment = (props) => {
    const {comment_id, comment_content,comment_created_at, comment_edited_at, user_name, user_id, comment_likes, comment_dislikes, comment_deleted} = props.data;
    const [comment, setComment] = useState(comment_content);
    const [edit, setEdit] = useState(false);
    const [deleted, setDeleted] = useState(comment_deleted);
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const transformDate = (date) => new Date(date).toLocaleDateString(undefined, dateOptions)
    const deleteComment = () => {postUpdateComment({comment, comment_id, delete:true}).then(() => {setEdit(false);setDeleted(true)})}
    return (
        <div className="comment-container">
            <div className="comment-user"><p>{user_name}</p></div>
            {!edit
            ?<div className="comment-content">
                {deleted?<p className="comment-deleted">Comment has been deleted</p>:parse(comment)}
                <div className="comment-sum-interactions"><p>{`${comment_likes+" likes"} - ${comment_dislikes+" dislikes"}`}</p></div>
                <div className="comment-interaction-container">
                    <button className="like-btn">&#128077; Like</button>
                    <button className="dislike-btn">&#128078; Dislike</button>
                    <AddComment user_id={props.userData.user_id} parent_comment_id={comment_id} type={props.type} type_id={props.type_id} buttonName="Reply"/>
                </div>
            </div>
            :<EditComment comment_id={comment_id} setEdit={setEdit} comment={comment} setComment={setComment}/>
            }
            <div className="comment-div">
                <div className="comment-dates">
                    <p>{transformDate(comment_created_at)}</p>{comment_edited_at&&<p>{`Edited: ${transformDate(comment_edited_at)}`}</p>}
                </div>
                {props.userData.user_id === user_id&&<>
                    <button className="edit-btn" onClick={() => setEdit(!edit)}>edit</button>
                    <button className="delete-btn" onClick={() => deleteComment()}>X</button>
                    </>}
            </div>
        </div>
    )
}
export default Comment;