import React,{useState} from "react";
import CommentsInput from "../commentsView/CommentsInput";
const AddNewBlog = ({userData}) => {
    const [blog, setBlog] = useState("")
    const [addBlog, setAddBlog] = useState(false)
    const uploadBlog = () => {}
    return (<div className="add-blog">
        <button className="add-blog-btn" onClick={() => {setAddBlog(!addBlog)}}> &#128172; Add New Blog</button>
        {addBlog&&<CommentsInput value={blog} setValue={setBlog}/>}
        {addBlog&&<button className="submit-comment-btn" onClick={uploadBlog}>Submit</button>}
    </div>) 
} 
export default AddNewBlog;