import React, {useState} from "react";
import { postCommentInteraction } from "../apiEffects";
const parse = require('html-react-parser');
const CommentInteractions = ({user_interaction, interactions, setInteractions, user_id, hash, comment_id}) => {
    const interactionButtons = [{label:"&#128077; Like", value:"like"},{label:"&#128078; Dislike", value:"dislike"}]
    const [commentInteractions, setCommentInteractions] = useState(user_interaction)
    const interact = (btn) => {
        if(user_id) {
            const newInteraction = commentInteractions===btn.value?null:btn.value;
            const change = commentInteractions===btn.value?-1:1;
            const changeOther = (commentInteractions===null||commentInteractions===btn.value)?0:change*-1;
            const otherBtn = btn.value==='like'?'dislikes':'likes';
            setInteractions({[btn.value+"s"]:interactions[btn.value+"s"]+change, [otherBtn]:interactions[otherBtn]+changeOther});
            setCommentInteractions(newInteraction);
            postCommentInteraction({type:newInteraction, user_id, hash,comment_id});
        }
    }
    return (<>
    {interactionButtons.map((i) => 
        <button className={`${i.value}-btn${commentInteractions===i.value?"-active":""}`} onClick={() => interact(i)}>{parse(i.label)}</button>)}
    </>)
}
export default CommentInteractions;