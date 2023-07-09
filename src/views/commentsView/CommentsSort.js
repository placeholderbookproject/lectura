import React,{useState, useEffect} from "react";
const CommentsSort = props => {
    const {comments, onSortChange} = props;
    const [sortOption, setSortOption] = useState({value:"comment_created_at", label:"Created"})
    const [sortOrder, setSortOrder] = useState("asc");
    useEffect(() => {
        const sortedComments = sortTable([...comments], sortOption.value, sortOrder); 
        onSortChange(sortedComments)}
        ,[sortOption, sortOrder])
    const sortTable = (table, sortKey, sortOrder) => {
        table.sort((a, b) => {
            const valueA = a[sortKey];
            const valueB = b[sortKey];
            if (valueA < valueB) {return sortOrder === 'asc' ? -1 : 1;}
            if (valueA > valueB) {return sortOrder === 'asc' ? 1 : -1;}
            return 0;});
        return table;
    }
    const handleChange = (e) => {
        const newSortOption = { value:e.target.value, label:e.target.label };
        setSortOption(newSortOption);
    };
    const sortOptions = [{value:"comment_created_at", label:"Created"},{value:"comment_edited_at", label:"Edited"}
                        ,{value:"comment_likes",label:"Likes"},{value:"comment_dislikes",label:"Dislikes"}]
    return (<>
        <select value={sortOption.value} label={sortOption.label} onChange={handleChange}>
            {sortOptions.map((s)=><option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button className="sort-btn" onClick={() => setSortOrder(oldOrder => oldOrder==="asc"?"desc":"asc")}>{sortOrder==="asc"?"desc":"asc"}</button>
    </>)
}
export default CommentsSort