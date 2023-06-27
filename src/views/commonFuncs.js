export const setTab = (event,tabOpen,setTabOpen) => {
    const oldTab = tabOpen,tab = event.target.textContent
    setTabOpen({...oldTab, [tab]:!tabOpen[tab]})
}

export const changeFormInput = (input,setInput,event) => {
    const oldInput = input;
    setInput({...oldInput, [event.target.name]:event.target.value})
}

export const searchSelect = (setQuery, e) => {setQuery(e.target.value);}