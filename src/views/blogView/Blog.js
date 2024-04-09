import React,{useState} from "react";
import { postUpdateComment } from "../apiEffects";
import { createCommentUrl, transformDate } from "../commonFuncs";
import CommentInteractions from "../commentsView/CommentInteractions";
import AddComment from "../commentsView/AddComment";
import EditComment from "../commentsView/EditComment";
const parse = require('html-react-parser');

const Blog = ({data, userData}) => {
    const {comment_id, comment_content,comment_created_at, comment_edited_at, user_name, user_id
        ,likes, dislikes, comment_deleted, user_interaction} = data;
    const [comment, setComment] = useState(comment_content);
    const [edit, setEdit] = useState(false);
    const [deleted, setDeleted] = useState(comment_deleted);
    const [interactions, setInteractions] = useState({likes, dislikes})
    const deleteComment = () => {postUpdateComment({comment, comment_id,user_id:userData.user_id,hash:userData.user_id, delete:true}).then(() => {setEdit(false);setDeleted(true)})}
    const url = createCommentUrl(data)
    return (<div className="blog-container">
        {!edit
        ?<div className="comment-content">
        {(userData.user_id === user_id||userData.user_role==='administrator')&&<div className='blog-interaction-container'>
                <button className="edit-btn" onClick={() => setEdit(!edit)}>edit</button>
                <button className="delete-btn" onClick={() => deleteComment()}>X</button>
                </div>}
        {parse(comment)}
        {<p>{`-${user_name}`}</p>}
        <div className="comment-sum-interactions"><p>{`${interactions.likes+" likes"} - ${interactions.dislikes+" dislikes"}`}</p></div>
        <div className="comment-interaction-container">
            {userData&&<CommentInteractions user_interaction={user_interaction} interactions={interactions} setInteractions={setInteractions} 
                    user_id={userData.user_id} hash={userData.hash} comment_id={comment_id}/>}
            <div className="comment-dates">
                    <p className={`comment-created-date${(comment_edited_at!=="NaT"&&comment_edited_at!==null)?"-edited":""}`}>
                        {transformDate(comment_created_at)}</p>
                    {(comment_edited_at!=="NaT"&&comment_edited_at!==null)&&<p><span style = {{"fontWeight": 600,}}>Edited </span>{`${transformDate(comment_edited_at)}`}</p>}
            </div>
            <AddComment properties={{user_id:userData.user_id, hash:userData.hash, parent_comment_id:comment_id, type:"blog", type_id:null, buttonName:"Reply"}} />
        </div>
        </div>
        :<div>
            <button className="edit-btn" onClick={() => setEdit(!edit)}>edit</button>
            <EditComment user_id={userData.user_id} hash={userData.hash} comment_id={comment_id} setEdit={setEdit} comment={comment} setComment={setComment}/>
        </div>}
    </div>)
}
export default Blog