import React, { PureComponent } from 'react';
import QuickPivot from 'quick-pivot';
import Table from '../Table/Table.jsx';
import PropTypes from 'prop-types';
import Menu from '../Menu/Menu.jsx';

import 'react-select/dist/react-select.css';
import './styles.scss';

export default class Pivot extends PureComponent {
  constructor(props) {
    super(props);

    const aggregationDimensions = this.props.data !== undefined ?
      this.props.data[0].map((item, index) => {
        return {value: item, label: item};
      }) :
      [];
    const dataArray = this.props.data !== undefined ? this.props.data : [];
    let fields = this.props.data !== undefined ? this.props.data[0] : [];
    const colFields = this.props.colFields || [];
    const rowFields = this.props.rowFields || [];

    if (fields.length) {
      colFields.forEach((field) => {
        if (fields.indexOf(field) > -1) {
          fields = [].concat(fields.slice(0, fields.indexOf(field)),
            fields.slice(fields.indexOf(field) + 1));
        }
      });
      rowFields.forEach((field) => {
        if (fields.indexOf(field) > -1) {
          fields = [].concat(fields.slice(0, fields.indexOf(field)),
            fields.slice(fields.indexOf(field) + 1));
        }
      });
    }

    const pivot = this.props.data !== undefined ?
      new QuickPivot(this.props.data, this.props.rowFields || [],
        this.props.colFields || [], this.props.selectedAggregationDimension ||
        '', 'sum', '') : {};

    Object.keys(this.props.filters).forEach((filter) => {
      pivot.filter((elem, index, array) => {
        return this.props.filters[filter].findIndex((field) => {
          return field === elem[filter];
        }) === -1;
      });
    });

    let headerCounter = 0;

    if (pivot.data) {
      while (true) {
        if (pivot.data.table[headerCounter].type === 'colHeader') {
          headerCounter += 1;
        } else {
          break;
        }
      }
    }

    this.state = {
      aggregationDimensions,
      dataArray,
      fields,
      pivot,
      colFields,
      rowFields,
      selectedAggregationType: 'sum',
      selectedAggregationDimension: this.props.selectedAggregationDimension ||
        '',
      currentFilter: '',
      currentValues: [],
      filters: this.props.filters,
      columnWidth: 100,
      columnCount:
      (pivot !== undefined && pivot.data.table.length &&
        pivot.data.table[0].value.length) ?
        pivot.data.table[0].value.length : 0,
      overscanColumnCount: 5,
      overscanRowCount: 5,
      headerHeight: 40,
      rowHeight: 30,
      rowCount: pivot !== undefined ? pivot.data.table.length : 0,
      data: pivot !== undefined ? pivot.data.table : [],
      header: {},
      headerCounter,
      isDrawerOpen: false,
    };

    this.onSelectAggregationDimension =
    this.onSelectAggregationDimension.bind(this);
    this.onSelectAggregationType = this.onSelectAggregationType.bind(this);
    this.onAddUpdateField = this.onAddUpdateField.bind(this);
    this.onToggleRow = this.onToggleRow.bind(this);
    this.checkIfInCollapsed = this.checkIfInCollapsed.bind(this);
    this.showFilterMenu = this.showFilterMenu.bind(this);
    this.setFields = this.setFields.bind(this);
    this.setRowFields = this.setRowFields.bind(this);
    this.setColFields = this.setColFields.bind(this);
    this.onFiltersOk = this.onFiltersOk.bind(this);
    this.onFiltersCancel = this.onFiltersCancel.bind(this);
    this.handleRightOpen = this.handleRightOpen.bind(this);
    this.handleRightClose = this.handleRightClose.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.onChange !== undefined) {
      const newState = nextProps.onChange(this.state);
      const aggregationDimensions = nextProps.data !== undefined ?
        nextProps.data[0].map((item, index) => {
          return {value: item, label: item};
        }) :
        [];
      const dataArray = nextProps.data !== undefined ? nextProps.data : [];
      let fields = nextProps.data !== undefined ? nextProps.data[0] : [];

      if (fields.length) {
        newState.colFields.forEach((field) => {
          if (fields.indexOf(field) > -1) {
            fields = [].concat(fields.slice(0, fields.indexOf(field)),
              fields.slice(fields.indexOf(field) + 1));
          }
        });
        newState.rowFields.forEach((field) => {
          if (fields.indexOf(field) > -1) {
            fields = [].concat(fields.slice(0, fields.indexOf(field)),
              fields.slice(fields.indexOf(field) + 1));
          }
        });
      }

      const pivot = nextProps.data !== undefined ?
        new QuickPivot(nextProps.data, newState.rowFields || [],
          newState.colFields || [], newState.selectedAggregationDimension ||
          '', 'sum', '') : {};

      Object.keys(newState.filters).forEach((filter) => {
        pivot.filter((elem, index, array) => {
          return newState.filters[filter].findIndex((field) => {
            return field === elem[filter];
          }) === -1;
        });
      });

      let headerCounter = 0;

      if (pivot.data) {
        while (true) {
          if (pivot.data.table[headerCounter].type === 'colHeader') {
            headerCounter += 1;
          } else {
            break;
          }
        }
      }

      this.setState({
        aggregationDimensions,
        dataArray: dataArray,
        fields,
        pivot,
        colFields: newState.colFields,
        rowFields: newState.rowFields,
        selectedAggregationDimension: newState.selectedAggregationDimension ||
          '',
        currentFilter: '',
        currentValues: [],
        filters: newState.filters,
        columnWidth: 100,
        columnCount:
        (pivot !== undefined && pivot.data.table.length &&
          pivot.data.table[0].value.length) ?
          pivot.data.table[0].value.length : 0,
        overscanColumnCount: newState.overscanColumnCount,
        overscanRowCount: newState.overscanRowCount,
        headerHeight: newState.headerHeight,
        rowHeight: newState.rowHeight,
        rowCount: pivot !== undefined ? pivot.data.table.length : 0,
        data: pivot !== undefined ? pivot.data.table : [],
        header: {},
        headerCounter: headerCounter,
        isDrawerOpen: newState.isDrawerOpen,
      });

    } else {
      const aggregationDimensions = nextProps.data !== undefined ?
        nextProps.data[0].map((item, index) => {
          return {value: item, label: item};
        }) :
        [];
      const dataArray = nextProps.data !== undefined ? nextProps.data : [];
      let fields = nextProps.data !== undefined ? nextProps.data[0] : [];

      if (fields.length) {
        nextProps.colFields.forEach((field) => {
          if (fields.indexOf(field) > -1) {
            fields = [].concat(fields.slice(0, fields.indexOf(field)),
              fields.slice(fields.indexOf(field) + 1));
          }
        });
        nextProps.rowFields.forEach((field) => {
          if (fields.indexOf(field) > -1) {
            fields = [].concat(fields.slice(0, fields.indexOf(field)),
              fields.slice(fields.indexOf(field) + 1));
          }
        });
      }

      const pivot = nextProps.data !== undefined ?
        new QuickPivot(nextProps.data, nextProps.rowFields || [],
          nextProps.colFields || [], nextProps.selectedAggregationDimension ||
          '', 'sum', '') : {};

      Object.keys(nextProps.filters).forEach((filter) => {
        pivot.filter((elem, index, array) => {
          return nextProps.filters[filter].findIndex((field) => {
            return field === elem[filter];
          }) === -1;
        });
      });

      let headerCounter = 0;

      if (pivot.data) {
        while (true) {
          if (pivot.data.table[headerCounter].type === 'colHeader') {
            headerCounter += 1;
          } else {
            break;
          }
        }
      }

      // Reset entire state execpt selectedAggregationType
      this.setState({
        aggregationDimensions,
        dataArray,
        fields,
        pivot,
        colFields: nextProps.colFields || [],
        rowFields: nextProps.rowFields || [],
        selectedAggregationDimension: nextProps.selectedAggregationDimension ||
          '',
        currentFilter: '',
        currentValues: [],
        filters: nextProps.filters,
        columnWidth: 100,
        columnCount:
        (pivot !== undefined && pivot.data.table.length &&
          pivot.data.table[0].value.length) ?
          pivot.data.table[0].value.length : 0,
        overscanColumnCount: 0,
        overscanRowCount: 5,
        rowHeight: 30,
        rowCount: pivot !== undefined ? pivot.data.table.length : 0,
        data: pivot !== undefined ? pivot.data.table : [],
        header: {},
        headerCounter,
      });
    }
  }

  onSelectAggregationType(selectedAggregationType) {
    const {
      colFields,
      dataArray,
      rowFields,
      selectedAggregationDimension,
      filters,
    } = this.state;

    const pivotedData = new QuickPivot(
      dataArray,
      rowFields,
      colFields,
      selectedAggregationDimension,
      selectedAggregationType.value,
      '',
    );

    Object.keys(filters).forEach((filter) => {
      pivotedData.filter((elem, index, array) => {
        return filters[filter].findIndex((field) => {
          return field === elem[filter];
        }) === -1;
      });
    });

    let headerCounter = 0;

    if (pivotedData.data) {
      while (true) {
        if (pivotedData.data.table[headerCounter].type === 'colHeader') {
          headerCounter += 1;
        } else {
          break;
        }
      }
    }

    this.setState({
      headerCounter,
      pivot: pivotedData,
      selectedAggregationType: selectedAggregationType.value,
      columnCount: (pivotedData.data.table.length &&
        pivotedData.data.table[0].value.length) ?
        pivotedData.data.table[0].value.length : 0,
      rowCount: pivotedData.data.table.length || 0,
      data: pivotedData.data.table,
      header: pivotedData.data.table[0],
    });
  }

  onSelectAggregationDimension(selectedAggregationDimension) {
    const {
      colFields,
      dataArray,
      rowFields,
      selectedAggregationType,
      filters,
    } = this.state;

    const pivotedData = new QuickPivot(
      dataArray,
      rowFields,
      colFields,
      selectedAggregationDimension.value,
      selectedAggregationType,
      '',
    );

    Object.keys(filters).forEach((filter) => {
      pivotedData.filter((elem, index, array) => {
        return filters[filter].findIndex((field) => {
          return field === elem[filter];
        }) === -1;
      });
    });

    let headerCounter = 0;

    if (pivotedData.data) {
      while (true) {
        if (pivotedData.data.table[headerCounter].type === 'colHeader') {
          headerCounter += 1;
        } else {
          break;
        }
      }
    }

    this.setState({
      headerCounter,
      pivot: pivotedData,
      selectedAggregationDimension: selectedAggregationDimension.value,
      columnCount: (pivotedData.data.table.length &&
        pivotedData.data.table[0].value.length) ?
        pivotedData.data.table[0].value.length : 0,
      rowCount: pivotedData.data.table.length || 0,
      data: pivotedData.data.table,
      header: pivotedData.data.table[0],
    });
  }

  onAddUpdateField() {
    const {
      colFields,
      dataArray,
      filters,
      rowFields,
      selectedAggregationDimension,
      selectedAggregationType,
    } = this.state;

    const pivotedData = new QuickPivot(
      dataArray,
      rowFields,
      colFields,
      selectedAggregationDimension,
      selectedAggregationType,
      '',
    );

    Object.keys(filters).forEach((filter) => {
      pivotedData.filter((elem, index, array) => {
        return filters[filter].findIndex((field) => {
          return field === elem[filter];
        }) === -1;
      });
    });

    let headerCounter = 0;

    if (pivotedData.data) {
      while (true) {
        if (pivotedData.data.table[headerCounter].type === 'colHeader') {
          headerCounter += 1;
        } else {
          break;
        }
      }
    }

    this.setState({
      headerCounter,
      pivot: pivotedData,
      columnCount: (pivotedData.data.table.length &&
          pivotedData.data.table[0].value.length) ?
        pivotedData.data.table[0].value.length : 0,
      rowCount: pivotedData.data.table.length || 0,
      data: pivotedData.data.table,
      header: pivotedData.data.table[0],
    });
  }

  onToggleRow(rowIndex) {
    const {
      pivot,
    } = this.state;

    // row index + headerCount because we remove/slice the header off the data we
    // render in the renderBodyCell
    const newPivot = pivot.toggle(rowIndex + this.state.headerCounter);

    this.setState({
      pivot: newPivot,
      columnCount: (newPivot.data.table.length &&
        newPivot.data.table[0].value.length) ?
        newPivot.data.table[0].value.length : 0,
      rowCount: newPivot.data.table.length || 0,
      data: newPivot.data.table,
      header: newPivot.data.table[0],
    });
  }

  checkIfInCollapsed(rowIndex) {
    const {
      headerCounter,
      pivot,
    } = this.state;

    return pivot.data.table[rowIndex + headerCounter].row in
      pivot.collapsedRows;
  }

  onFiltersOk({checked, unchecked, allChecked, filter}) {
    const {
      colFields,
      filters,
      rowFields,
      selectedAggregationDimension,
      selectedAggregationType,
      currentFilter,
    } = this.state;

    unchecked = unchecked.map((item) => {
      return item.label;
    });
    filters[currentFilter] = unchecked;

    // create new pivot and apply all filters. Because quick-pivot does not
    // account for removal of filters
    const newPivot = this.props.data !== undefined ?
      new QuickPivot(this.props.data, rowFields, colFields,
        selectedAggregationDimension || '', selectedAggregationType, '') :
      {};

    Object.keys(filters).forEach((filter) => {
      newPivot.filter((elem, index, array) => {
        return filters[filter].findIndex((field) => {
          // eslint-disable-next-line
          return field == elem[filter];
        }) === -1;
      });
    });

    let headerCounter = 0;

    if (newPivot.data) {
      while (true) {
        if (newPivot.data.table && newPivot.data.table.length > 0) {
          if (newPivot.data.table[headerCounter].type === 'colHeader') {
            headerCounter += 1;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    this.setState({
      filters,
      headerCounter,
      pivot: newPivot,
      columnCount: (newPivot.data.table.length &&
        newPivot.data.table[0].value.length) ?
        newPivot.data.table[0].value.length : 0,
      rowCount: newPivot.data.table.length || 0,
      data: newPivot.data.table,
      header: newPivot.data.table[0],
      currentFilter: '',
    });
  }

  onFiltersCancel() {
    this.setState({
      currentFilter: '',
      currentValues: [],
    });
  }

  showFilterMenu(field) {
    const {
      pivot,
    } = this.state;

    const uniqueValues = pivot.getUniqueValues(field);

    this.setState({
      currentFilter: field,
      currentValues: uniqueValues,
    });
  }

  setFields(fields) {
    this.setState({
      fields,
    });
  }

  setRowFields(rowFields) {
    this.setState({
      rowFields,
    });
  }

  setColFields(colFields) {
    this.setState({
      colFields,
    });
  }

  handleRightOpen() {
    this.toggleDrawer(true);
  };

  handleRightClose(e) {
    this.onFiltersCancel();
    this.toggleDrawer(false);
  };

  toggleDrawer(open) {
    this.setState({ isDrawerOpen: open });
  };

  render() {
    const {
      aggregationDimensions,
      colFields,
      columnCount,
      columnWidth,
      currentFilter,
      currentValues,
      fields,
      filters,
      headerCounter,
      headerHeight,
      overscanColumnCount,
      overscanRowCount,
      pivot,
      rowFields,
      rowHeight,
      selectedAggregationDimension,
      selectedAggregationType,
      isDrawerOpen,
    } = this.state;

    let {
      data,
      rowCount,
    } = this.state;

    const {
      bodyCellValueTransformation,
      colorPack,
      onGridCellClick,
      onGridHeaderCellClick,
      onLeftGridCellClick,
      onLeftHeaderCellClick,
      rowTotals,
    } = this.props;

    const aggregationTypes = [
      { value: 'sum', label: 'sum' },
      { value: 'count', label: 'count' },
      { value: 'min', label: 'min' },
      { value: 'max', label: 'max' },
      { value: 'average', label: 'average' },
    ];

    if (data !== undefined && data.length && !rowTotals) {
      rowCount = rowCount - 1;
      data = data.slice(0, rowCount);
    }

    return (
      <section className="react-virtualized-pivot-module">
        <Menu
          colorPack={colorPack}
          selectedAggregationType={selectedAggregationType}
          aggregationTypes={aggregationTypes}
          onSelectAggregationType={this.onSelectAggregationType}
          selectedAggregationDimension={selectedAggregationDimension}
          aggregationDimensions={aggregationDimensions}
          onSelectAggregationDimension={this.onSelectAggregationDimension}
          fields={fields}
          filters={filters}
          currentValues={currentValues}
          submitFilters={this.submitFilters}
          showFilterMenu={this.showFilterMenu}
          rowFields={rowFields}
          colFields={colFields}
          onAddUpdateField={this.onAddUpdateField}
          setFields={this.setFields}
          setRowFields={this.setRowFields}
          setColFields={this.setColFields}
          currentFilter={currentFilter}
          onFiltersOk={this.onFiltersOk}
          onFiltersCancel={this.onFiltersCancel}
          handleRightClose={this.handleRightClose}
          isDrawerOpen={isDrawerOpen}
        />
        <div className="pivot-grid">
          <section className="pivot-grid">
            <Table
              bodyCellValueTransformation={bodyCellValueTransformation}
              checkIfInCollapsed={this.checkIfInCollapsed}
              collapsedRows={pivot.collapsedRows}
              colorPack={colorPack}
              columnCount={columnCount}
              columnWidth={columnWidth}
              data={data !== undefined ? data : [[]]}
              headerCounter={headerCounter}
              headerHeight={headerHeight}
              onGridCellClick={onGridCellClick}
              onGridHeaderCellClick={onGridHeaderCellClick}
              onLeftGridCellClick={onLeftGridCellClick}
              onLeftHeaderCellClick={onLeftHeaderCellClick}
              onToggleRow={this.onToggleRow}
              originalArgs={pivot.originalArgs}
              overscanColumnCount={overscanColumnCount}
              overscanRowCount={overscanRowCount}
              rawData={pivot.data.rawData}
              rowCount={rowCount}
              rowFields={rowFields}
              colFields={colFields}
              rowHeight={rowHeight}
              handleRightOpen={this.handleRightOpen}
            />
          </section>
        </div>
      </section>
    );
  }
}

Pivot.propTypes = {
  bodyCellValueTransformation: PropTypes.func,
  colorPack: PropTypes.object,
  data: PropTypes.array.isRequired,
  filters: PropTypes.object,
  onChange: PropTypes.func,
  onGridCellClick: PropTypes.func,
  onGridHeaderCellClick: PropTypes.func,
  onLeftGridCellClick: PropTypes.func,
  onLeftHeaderCellClick: PropTypes.func,
  rowTotals: PropTypes.bool,
  selectedAggregationDimension: PropTypes.string,
};

Pivot.defaultProps = {
  bodyCellValueTransformation: ({value}) => value,
  colorPack: {
    bodyGridBackground: '#fff',
    bodyGridText: '#000',
    columnResizer: '#e0e0e0',
    evenRowBackground: '#fff',
    gridBorders: '#e0e0e0',
    headerGridBackground: '#fafafa',
    headerGridText: '#000',
    icons: '#ccc',
    leftHeaderCellBackground: '#fafafa',
    leftHeaderCellText: '#000',
    leftSideGridBackground: '#fff',
    leftSideGridText: '#000',
    oddRowBackground: '#fafafa',
    selectorContainerTitleBackground: '#fafafa',
    selectorContainerTitleText: '#000',
    sortableContainerBackground: '#fff',
    sortableContainerBorderColor: '#ccc',
    sortableFieldBackground: '#fafafa',
    sortableFieldText: '#000',
  },
  filters: {},
  onGridCellClick: () => {},
  onGridHeaderCellClick: () => {},
  onLeftGridCellClick: () => {},
  onLeftHeaderCellClick: () => {},
  rowTotals: true,
};
