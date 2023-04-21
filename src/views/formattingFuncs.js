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

export const reformatWikidata = (wiki) => {
    const columns = wiki.head.vars;
    let reformData = {};
    for (let i = 0; i<columns.length; i++) {
        let col = columns[i], dataPoint = "";
        const resultLength = wiki.results.bindings.length
        for (let j = 0;j<resultLength;j++){
            const row = wiki.results.bindings[j]
            if (Object.keys(row).includes(col)){
                const val = row[col].value;
                if(val===undefined) {continue}
                else if (j ===0){dataPoint = dataPoint+val}
                else if (!dataPoint.includes(val)&&j!==resultLength) {dataPoint = dataPoint + ", " + val }
                else if (!dataPoint.includes(val)&&j===resultLength){dataPoint = dataPoint + ", " + val}
            } else {dataPoint = null}
        }
        reformData[col] = dataPoint;
    } return reformData
};

export const reformatWikitexts = (wiki) => {
    const results = wiki.results.bindings;
    // group the results by the "book" column
    let grouped = {}
    for (let row of results) {
      let book = row.book.value;
      if (!grouped[book]) {
        grouped[book] = {};
      }
      for (let key in row) {
        if (key !== "book") {
          let val = row[key].value;
          if (grouped[book][key]) {
            if (!grouped[book][key].includes(val)) {
              grouped[book][key].push(val);
            }
          } else {
            grouped[book][key] = [val];
          }
        }
      }
    }    
    let output = [];
    for (let book in grouped) {
        let group = grouped[book];
        let row = { book: book };
        for (let key in group) {
        let values = group[key];
        row[key] = values.join(", ");
        }
        output.push(row);
    }
    return output
}

export const dateCoalesce = (date1, date2, date3) => {
    let selectedDate
    if (date1) {
        selectedDate = date1;
    } else if (date2) {
        selectedDate = date2;
    } else if (date3){
        selectedDate = date3;
    }
    return selectedDate
}