import React,{useState, useEffect, useRef} from "react";
import Comment from "./Comment";

const CommentsList = ({comments, userData, type, type_id}) => {
    const [showReplies, setShowReplies] = useState({});
    const commentRefs = useRef({});
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const commentId = urlParams.get('comment_id');
      if (commentId && commentRefs.current[commentId]) {
          commentRefs.current[commentId].scrollIntoView({ behavior: "smooth", block: "start" });
      }
  }, []);
    const toggleReplies = (level) => {setShowReplies( oldShowReplies => {return {...oldShowReplies, [level]:!oldShowReplies[level]}});}
    const renderComments = (comments, level = 0) => {
        return (
          <ul className={`comment-list level-${level}`}>
            {comments.map((comment) => (
              <li key={comment.comment_id} className="comment-item" ref={el => commentRefs.current[comment.comment_id] = el}>
              <div className="comment-content"><Comment data={comment} userData={userData} type={type} type_id={type_id} /></div>
              {comment.replies && comment.replies.length>0&& (
                <button className="show-replies-btn" onClick={() => toggleReplies(level)}>
                {showReplies[level] ? 'Hide Replies' : `Show Replies ${comment.replies.length>0?"("+comment.replies.length+")":""}`}
                </button>)}
                {showReplies[level]&&comment.replies && comment.replies.length > 0 && (
                  <div className="comment-replies">
                    {renderComments(comment.replies, level + 1)}
                  </div>
                )}
              </li>))}
          </ul>
        );
      };
    return <div className="comment-list-container">{renderComments(comments)}</div>;
}
export default CommentsList;