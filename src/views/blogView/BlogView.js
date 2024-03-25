import React from "react";
import AddNewBlog from "./AddNewBlog";
const BlogView = ({userData, labels}) => {
    return (<div>
        {userData.user_role==="administrator"&&<AddNewBlog userData={userData}/>}
    </div>)
}
export default BlogView;