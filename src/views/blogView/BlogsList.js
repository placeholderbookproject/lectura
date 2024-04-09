import React,{useState, useEffect, useRef} from "react";
import Blog from "./Blog";
const BlogsList = ({blogs, userData}) => {
    const [showReplies, setShowReplies] = useState({});
    const commentRefs = useRef({});
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const commentId = urlParams.get('comment_id');
      if (commentId && commentRefs.current[commentId]) {
          commentRefs.current[commentId].scrollIntoView({ behavior: "smooth", block: "start" });
      }
  }, []);
    const toggleReplies = (level) => {setShowReplies(oldShowReplies => {return {...oldShowReplies, [level]:!oldShowReplies[level]}});}
    const renderComments = (blogs, level = 0) => {
        return (
          <ul className={`comment-list level-${level}`}>
            {blogs.map((blog) => (
              <li key={blog.comment_id} className="comment-item" ref={el => commentRefs.current[blog.comment_id] = el}>
              <div className="comment-content"><Blog data={blog} userData={userData} /></div>
              {blog.replies && blog.replies.length>0&& (
                <button className="show-replies-btn" onClick={() => toggleReplies(level)}>
                {showReplies[level] ? 'Hide Replies' : `Show Replies ${blog.replies.length>0?"("+blog.replies.length+")":""}`}
                </button>)}
                {showReplies[level]&&blog.replies && blog.replies.length > 0 && (
                  <div className="comment-replies">
                    {renderComments(blog.replies, level + 1)}
                  </div>
                )}
              </li>))}
          </ul>
        );
      };
    return <div className="comment-list-container">{renderComments(blogs)}</div>;}
export default BlogsList;