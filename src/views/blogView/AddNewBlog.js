import React,{useState} from "react";
import CommentsInput from "../commentsView/CommentsInput";
import { postComment } from "../apiEffects";
const AddNewBlog = ({userData}) => {
    const {user_id, hash} = userData
    const [blog, setBlog] = useState("")
    const [addBlog, setAddBlog] = useState(false)
    const uploadBlog = () => {
        const body = {comment:blog,user_id, hash,parent_comment_id:null, type:"blog", type_id:null}
        postComment(body).then(() => {setAddBlog(false);setBlog("")})
    }
    return (<div className="add-blog">
        <button className="add-blog-btn" onClick={() => {setAddBlog(!addBlog)}}> &#128172; Add New Blog</button>
        {addBlog&&<CommentsInput value={blog} setValue={setBlog}/>}
        {addBlog&&<button className="submit-comment-btn" onClick={uploadBlog}>Submit</button>}
    </div>) 
} 
export default AddNewBlog;