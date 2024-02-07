import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CommentsInput = props => {return (<ReactQuill theme="snow" value={props.value} onChange={props.setValue}/>)}
export default CommentsInput;