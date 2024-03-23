import React from "react";

export const sortList = (list,keys, descending) => {
    return list.map((element) => {
        const priorityKey = keys.find((key) => element[key]);
        return { ...element, priorityKey:element[priorityKey]};
      }).sort((a, b) => {
        if (a.priorityKey < b.priorityKey) {return descending?-1:1;}
        if (a.priorityKey > b.priorityKey) {return descending?1:-1;}
        return 0;
      });
}

const Sort = ({sortKey, setSortKey}) => {
  const handleSortChange = () => {setSortKey({ ...sortKey, descending: !sortKey.descending });}; 
  return (<button className="reorderBtn" value={sortKey.keys} onClick={handleSortChange}>{`Sort (${sortKey.descending?"Desc":"Asc"})`}</button>)
}
export default Sort;