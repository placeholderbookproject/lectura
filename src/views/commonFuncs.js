export const setTab = (value,tabOpen,setTabOpen) => {
    const oldTab = tabOpen,tab = value
    setTabOpen({...oldTab, [tab]:!tabOpen[tab]})
}

export const changeFormInput = (input,setInput,event) => {
    const oldInput = input;
    setInput({...oldInput, [event.target.name]:event.target.value})
}

export const search = (controller = undefined,setQuery,setSearchResults, func=undefined, event) => {
    if (event.key==="Enter"){controller&&controller.abort(); setQuery(""); func&&func() /*navigate(`/search?query=${query}&type=authors`)*/}
    else if (event.key==="Escape"){setQuery("");setSearchResults();}
}

export const createCommentUrl = (comment_data) => {
    const {author_id, comment_type, comment_type_id, comment_id} = comment_data
    return comment_type==="text"?`/author/${author_id}/text/${comment_type_id}/?comment_id=${comment_id}`
                                :comment_type==="list"?`/lists/personal/${comment_type_id}/?comment_id=${comment_id}`
                                                        :`/author/${comment_type_id}/?comment_id=${comment_id}`
}
export const transformDate = (date) => {
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, dateOptions)

}