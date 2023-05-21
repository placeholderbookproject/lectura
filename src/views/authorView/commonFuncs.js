export const setTab = (event,tabOpen,setTabOpen) => {
    const oldTab = tabOpen,tab = event.target.textContent
    setTabOpen({...oldTab, [tab]:!tabOpen[tab]})
}