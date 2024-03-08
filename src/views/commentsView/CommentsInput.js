import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CommentsInput = ({value, setValue}) => {return (<ReactQuill theme="snow" value={value} onChange={setValue}/>)}
export default CommentsInput;