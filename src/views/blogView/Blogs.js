import React, {useState, useEffect} from "react";
import { getComments } from "../apiEffects";
import BlogsList from "./BlogsList";
const Blogs = ({userData, labels}) => {
    const [blogs, setBlogs] = useState([])
    useEffect(() => {getComments('blog', null, userData.user_id, setBlogs)},[])
    return (<div>
        {blogs.length>0&&<BlogsList blogs={blogs} userData={userData}/>}
    </div>)
}
export default Blogs;