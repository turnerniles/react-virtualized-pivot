/**
 * Return children and children data comprising a row when clicked
 * @params {
    collapsedRows: Array,
    columnIndex: number,
    data: Array,
    headerCounter: number,
    onGridCellClick: function,
    originalArgs: Object,
    rawData: Array,
    rowIndex: number,
  }
 * @returns {Object}
*/
export default function onClick({
  collapsedRows,
  columnIndex,
  data,
  headerCounter,
  onGridCellClick,
  originalArgs,
  rawData,
  rowIndex,
}) {
  function getCollapsedRows(rowNum, dataStr) {
    const rows = rowNum in collapsedRows ? collapsedRows[rowNum].table : [];
    const collapsedData = rowNum in collapsedRows ?
      collapsedRows[rowNum][dataStr] :
      [];

    return collapsedData.reduce((acc, { type, value }, index) => {
      const row = rows[index].row;

      if (type === 'data') {
        return acc.concat([value.slice(0, 1)
          .concat([value[columnIndex + 1]])]);
      }

      return acc.concat(getCollapsedRows(row, dataStr));
    }, []);
  }

  function getChildren(rowIndex, acc, startingDepth) {
    const dataRow = data.slice(headerCounter)[rowIndex];
    const rawDataRow = rawData.slice(headerCounter)[rowIndex];

    if (!dataRow ||
      (acc.children.length > 0 && startingDepth >= dataRow.depth)) {
      return acc;
    }

    if (dataRow.type === 'data') {
      const obj = {
        children: acc.children.concat([dataRow.value.slice(0, 1)
          .concat([dataRow.value[columnIndex + 1]])]),
        childrenData: acc.childrenData.concat([rawDataRow.value.slice(0, 1)
          .concat([rawDataRow.value[columnIndex + 1]])]),
      };

      return getChildren(rowIndex + 1, obj, startingDepth);
    }

    const obj = {
      children: acc.children.concat(getCollapsedRows(dataRow.row, 'table')),
      childrenData: acc.childrenData
        .concat(getCollapsedRows(dataRow.row, 'rawData')),
    };

    return getChildren(rowIndex + 1, obj, startingDepth);
  }

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

  function getColumnHeaders(columnIndex) {
    if (originalArgs.cols.length === 0) return {};

    let currRow = 0;
    const acc = {};

    while (data[currRow].type === 'colHeader') {
      acc[originalArgs.cols[currRow]] = data[currRow].value[columnIndex];
      currRow++;
    }

    return acc;
  }

  const { children, childrenData } = data.length > 0 ?
    getChildren(rowIndex, {children: [], childrenData: []},
      data[headerCounter + rowIndex].depth) :
    [];

  const rowHeaders = getRowHeaders(rowIndex);
  const columnHeaders = getColumnHeaders(columnIndex + 1);

  onGridCellClick({
    children,
    childrenData,
    columnHeaders,
    columnIndex,
    rowHeaders,
    rowIndex,
  });
}
