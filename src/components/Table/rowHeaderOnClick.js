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

  if (columnIndex === 0) onToggleRow(rowIndex);

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
}
