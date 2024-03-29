import React from "react";
const BrowseOptions = ({labels, lang, setType}) => {
    const options = [{label:"Authors", value:"authors"},{label:"Texts", value:"texts"}]
    return (<div className="browse-options">{options.map((opt) => <button onClick={()=>setType(opt.value)}>{opt.label}</button>)}</div>)
}
export default BrowseOptions;
