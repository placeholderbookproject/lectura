import React from "react";
import AddNewBlog from "./AddNewBlog";
import Blogs from "./Blogs";
const BlogView = ({userData, labels}) => {
    return (<div>
        {userData.user_role==="administrator"&&<AddNewBlog userData={userData}/>}
        <Blogs userData={userData} labels={labels}/>
    </div>)
}
export default BlogView;