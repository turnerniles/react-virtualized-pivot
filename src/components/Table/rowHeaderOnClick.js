/**
 * Return children and children data comprising a row when clicked
 * @params {
    collapsedRows: Array,
    columnIndex: number,
    data: Array,
    headerCounter: number,
    onLeftGridCellClick: function,
    originalArgs: Object,
    rawData: Array,
    rowIndex: number,
    onToggleRow: function
  }
 * @returns {Object}
*/
export default function onClick({
  collapsedRows,
  columnIndex,
  data,
  headerCounter,
  onLeftGridCellClick,
  originalArgs,
  rawData,
  rowIndex,
  onToggleRow,
}) {
  /**
   * @params {number} rowNum
   * @params {string} dataStr The data type to retrieve (rawData or table)
   * @returns {Array}
  */
  function getCollapsedRows(rowNum, dataStr) {
    const rows = rowNum in collapsedRows ? collapsedRows[rowNum].table : [];
    const collapsedData = rowNum in collapsedRows ?
      collapsedRows[rowNum][dataStr] :
      [];

    return collapsedData.reduce((acc, { type, value }, index) => {
      const row = rows[index].row;

      if (type === 'data') return acc.concat([value]);
      return acc.concat(getCollapsedRows(row, dataStr));
    }, []);
  }

  /**
   * @params {number} rowIndex
   * @params {Object} acc
   * @params {number} startingDepth
   * @returns {Object}
  */
  function getChildren(rowIndex, acc, startingDepth) {
    const dataRow = data[headerCounter + rowIndex];
    const rawDataRow = rawData[headerCounter + rowIndex];

    if (!dataRow ||
      (acc.children.length > 0 && startingDepth >= dataRow.depth)) {
      return acc;
    }

    let obj;

    if (dataRow.type === 'data') {
      obj = {
        children: acc.children.concat([dataRow.value]),
        childrenData: acc.childrenData.concat([rawDataRow.value]),
      };
    } else {
      obj = {
        children: acc.children.concat(getCollapsedRows(dataRow.row, 'table')),
        childrenData: acc.childrenData
          .concat(getCollapsedRows(dataRow.row, 'rawData')),
      };
    }

    return getChildren(rowIndex + 1, obj, startingDepth);
  }

  /**
   * groups all parent row headers for a particular row index
   * @params {number} rowIndex
   * @returns {Object}
  */
  function getRowHeaders(rowIndex) {
    if (originalArgs.rows.length === 0) return {};

    const slicedData = data.slice(headerCounter);
    const { value, depth } = slicedData[rowIndex];
    const acc = { [originalArgs.rows[depth]]: value[0] };
    let nextDepth = depth - 1;
    let counter = rowIndex - 1;

    while (nextDepth >= 0) {
      let nextValue = null;

      while (nextValue === null) {
        if (slicedData[counter].depth === nextDepth) {
          nextValue = slicedData[counter].value[0];
        }
        counter--;
      }

      acc[originalArgs.rows[nextDepth]] = nextValue;
      nextDepth--;
    }

    return acc;
  }

  const { children, childrenData } = data.length > 0 ?
    getChildren(rowIndex, {children: [], childrenData: []},
      data[headerCounter + rowIndex].depth) :
    [];

  const rowHeaders = getRowHeaders(rowIndex);

  onLeftGridCellClick({
    children,
    childrenData,
    columnIndex,
    rowHeaders,
    rowIndex,
  });

  /** need to toggle row after recursing children to prevent race condition */
  if (columnIndex === 0) onToggleRow(rowIndex);
}
