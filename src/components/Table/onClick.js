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
  /**
   * @params {number} rowNum
   * @params {string} dataStr The data type to retrieve (rawData or table)
   * @returns {Array}
  */
  function getCollapsedRows(rowNum, dataStr) {
    /** if rowNum is in collapsedRows, then the row is in fact collapsed */
    const rows = rowNum in collapsedRows ? collapsedRows[rowNum].table : [];
    const collapsedData = rowNum in collapsedRows ?
      collapsedRows[rowNum][dataStr] :
      [];

    return collapsedData.reduce((acc, { type, value }, index) => {
      const row = rows[index].row;

      /** if row is not a header row, no need to recurse */
      if (type === 'data') {
        return acc.concat([[value[0]].concat([value[columnIndex + 1]])]);
      }

      /**
       * if the row is a header row, need to check if it is collapsed
       * and if so, add it to the accumulated results
      */
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
    /** get current row of table data and raw data */
    const dataRow = data[headerCounter + rowIndex];
    const rawDataRow = rawData[headerCounter + rowIndex];

    /**
     * base case
     * if there is no dataRow or
     * if there are already children and the current row is a sibling or parent
    */
    if (!dataRow ||
      (acc.children.length > 0 && startingDepth >= dataRow.depth)) {
      return acc;
    }

    let obj;

    /**
     * if the row is a data row rather than a rowHeader
     * add it to accumulation
    */
    if (dataRow.type === 'data') {
      obj = {
        children: acc.children.concat([[dataRow.value[0]]
          .concat([dataRow.value[columnIndex + 1]])]),
        childrenData: acc.childrenData.concat([[rawDataRow.value[0]]
          .concat([rawDataRow.value[columnIndex + 1]])]),
      };
    } else {
      /** add any collapsed rows to accumulation */
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
    /** if there is no data, return empty object */
    if (originalArgs.rows.length === 0) return {};

    /**
     * slice off header rows
     * get starting value and depth
     * initialize acc object
    */
    const slicedData = data.slice(headerCounter);
    const { value, depth } = slicedData[rowIndex];
    const acc = { [originalArgs.rows[depth]]: value[0] };
    let nextDepth = depth - 1;
    let counter = rowIndex - 1;

    /** check that next row header exists (i.e. not at top level parent) */
    while (nextDepth >= 0) {
      let nextValue = null;

      while (nextValue === null) {
        /** if next row is the parent, assign to nextValue */
        if (slicedData[counter].depth === nextDepth) {
          nextValue = slicedData[counter].value[0];
        }
        counter--;
      }

      /** set row type as key and value as value in acc object */
      acc[originalArgs.rows[nextDepth]] = nextValue;
      nextDepth--;
    }

    return acc;
  }

  /**
   * groups column headers for a particular column index
   * @params {number} columnIndex
   * @returns {Object} acc
  */
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

  /**
   * if there is no data
   * return empty array
   * else recurse to group all children
 */
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
