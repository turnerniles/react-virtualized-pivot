/**
 * Returns a collapsed arrow, dropdown arrow, or empty string
 * @param {{
    checkIfInCollapsed: function,
    colFields: Array,
    data: Array,
    headerCounter: number,
    rowFields: Array,
    rowIndex: number,
  }}
  * @returns {string}
*/
export default function arrowStyle({
  checkIfInCollapsed,
  colFields,
  data,
  headerCounter,
  rowFields,
  rowIndex,
}) {
  if (checkIfInCollapsed(rowIndex)) {
    return '►';
  }
  if (rowFields.length === 0 &&
    data[headerCounter + rowIndex].depth < colFields.length - 1) {
    return '▼';
  }
  if (data[headerCounter + rowIndex].depth < rowFields.length - 1) {
    return '▼';
  }
  return '';
};
