export const checkStr = (a,b, delimiter = null, limitA = "", limitB = "") => {
    if (a === delimiter && b === delimiter) {return ""}
    else if (a === delimiter && b !== delimiter) {return "(" + limitB + b + ")"}
    else if (a !== delimiter && b === delimiter) {return "(" + limitA + a + ")"}
    else if (a !== delimiter && b !== delimiter) {return "(" + a + ", " + b + ")"}
}

export const transformYear = (year, label) => {
    if(year<0) {return Math.abs(year) + " BC"}
    else if (year>0) {return year + " AD"}
    else {return label}
}
export const transformPeriodRange = (year1, year2) => {
    if(year2&&year1){return Math.abs(year1)+'-'+transformYear(year2,'')}
    else if (!year2 && year1){return transformYear(year1,'')}
    else if (!year1&&year2){return 'NA - ' + transformYear(year2,'')}
    else {return ''}
}

export const checkData = (data1,data2) => {
    if(data1===null||data1===undefined||data1===""){return data2}
    else{return data1}
}

export const reformatWikidata = (wiki) => {
    const columns = wiki.head.vars;
    let reformData = {};
    for (let i = 0; i<columns.length; i++) {
        let col = columns[i], dataPoint = "";
        const resultLength = wiki.results.bindings.length
        for (let j = 0;j<resultLength;j++){
            const row = wiki.results.bindings[j]
            if(Object.keys(row)===null){continue}
            if (Object.keys(row).includes(col)){
                const val = row[col].value;
                if(val===undefined||dataPoint===null) {continue}
                else if (j ===0){dataPoint = dataPoint+val}
                else if (!dataPoint.includes(val)&&j!==resultLength) {dataPoint = dataPoint + ", " + val }
                else if (!dataPoint.includes(val)&&j===resultLength){dataPoint = dataPoint + ", " + val}
            } else {dataPoint = null}
        }; reformData[col] = dataPoint;
    } return reformData
};

export const reformatWikitexts = (wiki) => {
    const results = wiki.results.bindings;
    let grouped = {}
    for (let row of results) {
        let book = row.book.value;
        if (!grouped[book]) {grouped[book] = {};}
        for (let key in row) {
            if (key !== "book") {
                let val = row[key].value;
                if (grouped[book][key]) 
                    {if (!grouped[book][key].includes(val)) {grouped[book][key].push(val);}} 
                    else {grouped[book][key] = [val];}}}
    }    
    let output = [];
    for (let book in grouped) {
        let group = grouped[book];
        let row = { book: book };
        for (let key in group) {
            let values = group[key];
            row[key] = values.join(" | ");
        }; output.push(row);
    }; return output
}

export const combineWiki = (wiki, type) => {
    const results = wiki.results.bindings;
    let grouped = {}
    for (let row of results){
        let element = row[type].value;
        if(!grouped[element]) {grouped[element] = {};}
        for (let key in row) {
            if (key !== type) {
                let val = row[key].value;
                if (grouped[element][key]) 
                    {if (!grouped[element][key].includes(val)) {grouped[element][key].push(val);}} 
                    else {grouped[element][key] = [val];}}}
    }
    let output = [];
    for (let element in grouped) {
        let group = grouped[element];
        let row = { [type]: element.replace('http://www.wikidata.org/entity/','') };
        for (let key in group) {
            let values = group[key];
            row[key] = values.join(" | ");
        }; output.push(row);
    }; return output
}

export const dateCoalesce = (date1, date2, date3, delimiter=', ') => {
    if (date1&&date1!==undefined) {return date1.split(delimiter)[0];
    } else if (date2&&date2!==undefined) {return date2.split(delimiter)[0];
    } else if (date3&&date3!==undefined){return date3.split(delimiter)[0];}
}

export const removeWorksOutOfBounds = (works, birth, death) => {
    const newBirth = Math.floor(birth/100)*100, newDeath = Math.ceil(death/100)*100, newWorks = []
    for (const work in works) {
        const text = works[work]
        const dateToCheck = dateCoalesce(text.publYear,text.dopYear, text.inceptionYear, " | ")
        if ((dateToCheck>=newBirth&&dateToCheck<=newDeath)||dateToCheck===null||dateToCheck===undefined) {newWorks.push(text)}
        else if ((dateToCheck>=newBirth&&newDeath===null)||dateToCheck===null||dateToCheck===undefined) {newWorks.push(text)}
        else if ((newBirth===null&&newDeath===null)) {newWorks.push(text)}
        else if ((newDeath===0)){newWorks.push(text)}
    } return newWorks
}

export const getUniquePropertyValues = (objects, property) =>  {
    return [...new Set(objects.flatMap(object => (object[property] || '').split(' | ')))].filter(Boolean);}

export const combineLists = (listA, listB, key) => {
    const listAArray = Array.isArray(listA) ? listA : [listA];
    const listBArray = Array.isArray(listB) ? listB : [listB];
    const results = listAArray.map((itemA) => {
        const correspondingItemB = listBArray.find((itemB) => itemB[key] === itemA[key]);
        return correspondingItemB ? { ...correspondingItemB,...itemA} : itemA;
    });
    return results.length === 1 ? results[0] : results;
};

export const removeDuplicatesList = (obj, key) => {
    const list = Array.isArray(obj)?Object.values(obj):[obj]
    const uniqueElements = new Map();
    list.forEach((element) => {uniqueElements.set(element[key], element);});
    return Array.from(uniqueElements.values());
};

export const filterArray = (array, removals) => {return array.filter(item => !removals.includes(item.value));}