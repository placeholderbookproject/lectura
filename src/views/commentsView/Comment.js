import React,{useState} from "react";
import AddComment from "./AddComment";
import EditComment from "./EditComment";
import { postUpdateComment } from "../apiEffects";
import CommentInteractions from "./CommentInteractions";
import { createCommentUrl, transformDate } from "../commonFuncs";
const parse = require('html-react-parser');

const Comment = (props) => {
    const {comment_id, comment_content,comment_created_at, comment_edited_at, user_name, user_id
            , likes, dislikes, comment_deleted, user_interaction} = props.data;
    const userData = props.userData
    const [comment, setComment] = useState(comment_content);
    const [edit, setEdit] = useState(false);
    const [deleted, setDeleted] = useState(comment_deleted);
    const [interactions, setInteractions] = useState({likes, dislikes})
    const deleteComment = () => {postUpdateComment({comment, comment_id,user_id:userData.user_id,hash:userData.user_id, delete:true}).then(() => {setEdit(false);setDeleted(true)})}
    const url = createCommentUrl(props.data)
    return (
        <div className="comment-container">
            <div className="comment-user"><p>{user_name}</p></div>
            {!edit
            ?<div className="comment-content">
                {deleted?<p className="comment-deleted">Comment has been deleted</p>:parse(comment)}
                <div className="comment-sum-interactions"><p>{`${interactions.likes+" likes"} - ${interactions.dislikes+" dislikes"}`}</p></div>
                <div className="comment-interaction-container">
                    <CommentInteractions user_interaction={user_interaction} interactions={interactions} setInteractions={setInteractions} 
                            user_id={userData.user_id} hash={userData.hash} comment_id={comment_id}/>
                    <AddComment properties={{user_id:userData.user_id, hash:userData.hash, parent_comment_id:comment_id, type:props.type, type_id:props.type_id, buttonName:"Reply"}} />
                </div>
            </div>
            :<EditComment user_id={userData.user_id} hash={userData.hash} comment_id={comment_id} setEdit={setEdit} comment={comment} setComment={setComment}/>
            }
            <div className="comment-div">
                <div className="comment-dates">
                    <p className={`comment-created-date${(comment_edited_at!=="NaT"&&comment_edited_at!==null)?"-edited":""}`}>
                        <a href={url}>{transformDate(comment_created_at)}</a></p>
                    {(comment_edited_at!=="NaT"&&comment_edited_at!==null)&&<p><span style = {{"fontWeight": 600,}}>Edited </span>{`${transformDate(comment_edited_at)}`}</p>}
                </div>
                {(props.userData.user_id === user_id||props.userData.user_role==='administrator')&&<>
                    <button className="edit-btn" onClick={() => setEdit(!edit)}>edit</button>
                    <button className="delete-btn" onClick={() => deleteComment()}>X</button>
                    </>}
            </div>
        </div>
    )
}
export default Comment;