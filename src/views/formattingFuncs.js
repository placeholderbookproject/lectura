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