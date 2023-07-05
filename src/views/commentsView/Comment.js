import React,{useState} from "react";
import AddComment from "./AddComment";
const parse = require('html-react-parser');

const Comment = (props) => {
    const {comment_id, comment_content,comment_created_at, comment_edited_at, user_name, user_id} = props.data;
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const transformDate = (date) => new Date(date).toLocaleDateString(undefined, dateOptions)
    const [edit, setEdit] = useState(false);
    return (<>
        <div className="comment-container">
            <div className="comment-user"><p>{user_name}</p></div>
            <div className="comment-content">
                {parse(comment_content)}
                <div className="comment-interaction-container">
                    <button className="like-btn">&#128077; Like</button>
                    <button className="dislike-btn">&#128078; Dislike</button>
                    <AddComment user_id={props.userData.user_id} parent_comment_id={comment_id} type={props.type} type_id={props.type_id} buttonName="Reply"/>
                </div>
            </div>
            <div className="comment-div">
                <div className="comment-dates">
                    <p>{transformDate(comment_created_at)}</p>{comment_edited_at&&<p>{`Edited: ${transformDate(comment_edited_at)}`}</p>}
                </div>
                {props.userData.user_id === user_id&&<button className="edit-btn" onClick={() => setEdit(!edit)}>edit</button>}
            </div>
        </div>
        </>
    )
}
export default Comment;