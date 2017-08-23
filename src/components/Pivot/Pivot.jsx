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
    const fields = this.props.data !== undefined ? this.props.data[0] : [];
    const pivot = this.props.data !== undefined ?
      new QuickPivot(this.props.data, [], [],
        this.props.selectedAggregationDimension || '', 'sum', '') :
      {};

    this.state = {
      aggregationDimensions,
      dataArray,
      fields,
      pivot,
      colFields: [],
      rowFields: [],
      selectedAggregationType: 'sum',
      selectedAggregationDimension: this.props.selectedAggregationDimension ||
        '',
      currentFilter: '',
      currentValues: [],
      filters: {},
      columnWidth: 75,
      columnCount: 0,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      headerHeight: 40,
      rowHeight: 20,
      rowCount: 0,
      data: [],
      header: {},
      headerCounter: 0,
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
    const aggregationDimensions = nextProps.data !== undefined ?
      nextProps.data[0].map((item, index) => {
        return {value: item, label: item};
      }) :
      [];
    const dataArray = nextProps.data !== undefined ? nextProps.data : [];
    const fields = nextProps.data !== undefined ? nextProps.data[0] : [];
    const pivot = nextProps.data !== undefined ?
      new QuickPivot(nextProps.data, [], [],
        nextProps.selectedAggregationDimension || '', 'sum', '') : {};

    // Reset entire state execpt selectedAggregationType
    this.setState({
      aggregationDimensions,
      dataArray,
      fields,
      pivot,
      colFields: [],
      rowFields: [],
      selectedAggregationDimension: nextProps.selectedAggregationDimension ||
        '',
      currentFilter: '',
      currentValues: [],
      filters: {},
      columnWidth: 75,
      columnCount: 0,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 20,
      rowCount: 0,
      data: [],
      header: {},
      headerCounter: 0,
    });
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
      console.log(filters[filter]);
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
    console.log('canceling filters');
    this.setState({
      currentFilter: '',
      currentValues: [],
    });
  }

  showFilterMenu(field) {
    console.log('showFilterMenu');
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
      data,
      fields,
      filters,
      headerCounter,
      headerHeight,
      overscanColumnCount,
      overscanRowCount,
      pivot,
      rowCount,
      rowFields,
      rowHeight,
      selectedAggregationDimension,
      selectedAggregationType,
      isDrawerOpen,
    } = this.state;

    const {
      bodyCellValueTransformation,
      colorPack,
      onGridCellClick,
      onGridHeaderCellClick,
      onLeftGridCellClick,
      onLeftHeaderCellClick,
    } = this.props;

    const aggregationTypes = [
      { value: 'sum', label: 'sum' },
      { value: 'count', label: 'count' },
      { value: 'min', label: 'min' },
      { value: 'max', label: 'max' },
      { value: 'average', label: 'average' },
    ];

    return (
      <section className="virtualized-pivot">
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
  onGridCellClick: PropTypes.func,
  onGridHeaderCellClick: PropTypes.func,
  onLeftGridCellClick: PropTypes.func,
  onLeftHeaderCellClick: PropTypes.func,
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
  onGridCellClick: () => {},
  onGridHeaderCellClick: () => {},
  onLeftGridCellClick: () => {},
  onLeftHeaderCellClick: () => {},
};
