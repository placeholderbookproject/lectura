import React, {useState} from 'react';

export const Comment = (props) =>  {
    const [likes, setLikes] = useState(0);
    const [showReplyForm, setShowReplyForm] = useState(false);
    //const { author, content, date } = props.comment;
    const comment = props.comment.comment;
    const replies = props.comment.replies;
    const handleLike = () => {setLikes(likes + 1);}  
    const handleReply = () => {setShowReplyForm(!showReplyForm);}
    return (
      <div>
        {<p>{comment}</p>}
        {/*<p>by {author} on {date}</p>*/}
        <button onClick={handleLike}>{likes} Likes</button>
        <button onClick={handleReply}>{showReplyForm?"Comment":"Comment"}</button>
        <CommentsList comments={replies} />
        {showReplyForm && <CommentForm />} {/*parentId={props.comment.id}*/}
      </div>
    );
  }
  
  const CommentsList = (props) => {
    return (
      <ul>
        {props.comments !== undefined &&props.comments.length>0?props.comments.map(comment => (
          <li key={comment.id}>
            <Comment comment={comment} />
          </li>
        ))
        :<></>
        }
      </ul>
    );
  }
  
const CommentForm = (props) => {
    const [comment, setComment] = useState('');
    const handleSubmit = (event) => {
      event.preventDefault();
      // create new comment object with parent id and add to comment list
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Comment:
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
  