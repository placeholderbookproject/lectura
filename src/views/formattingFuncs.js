export const checkStr = (a,b, delimiter = null, limitA = "", limitB = "") => {
    let result = ""
    if (a === delimiter && b === delimiter) {result = ""}
    else if (a === delimiter && b !== delimiter) {result = "(" + limitB + b + ")"}
    else if (a !== delimiter && b === delimiter) {result = "(" + limitA + a + ")"}
    else if (a !== delimiter && b !== delimiter) {result = "(" + a + ", " + b + ")"}
    return result
}