import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
                                    :comment_type==="author"?`/author/${comment_type_id}/?comment_id=${comment_id}`:`/blog`;
}
export const transformDate = (date) => {
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, dateOptions)
}
export const transformXLSX = (obj) => {
    const headers = Object.keys(obj[0]);
    const dataArray = [
        headers, // Include header row
        ...obj.map(item => Object.values(item))
      ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'texts.xlsx');
}