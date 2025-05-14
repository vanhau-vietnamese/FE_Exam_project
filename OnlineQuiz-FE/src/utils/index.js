export function getExcelColName(colNum) {
  let str = '';
  while (colNum > 0) {
    const remainder = (colNum - 1) % 26;
    str = String.fromCharCode(65 + remainder) + str;
    colNum = Math.floor((colNum - 1) / 26);
  }
  return str;
}
