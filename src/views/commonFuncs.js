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
