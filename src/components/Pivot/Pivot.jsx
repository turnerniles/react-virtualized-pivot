import React, { PureComponent } from 'react';
import QuickPivot from 'quick-pivot';
import Table from '../Table/Table.jsx';
import PropTypes from 'prop-types';
import Menu from '../Menu/Menu.jsx';

window.pivot = QuickPivot;

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
    };

    this.onSelectAggregationDimension =
    this.onSelectAggregationDimension.bind(this);
    this.onSelectAggregationType = this.onSelectAggregationType.bind(this);
    this.onAddUpdateField = this.onAddUpdateField.bind(this);
    this.onToggleRow = this.onToggleRow.bind(this);
    this.checkIfInCollapsed = this.checkIfInCollapsed.bind(this);
    this.displayFilter = this.displayFilter.bind(this);
    this.addToFilters = this.addToFilters.bind(this);
    this.submitFilters = this.submitFilters.bind(this);
    this.showFilterMenu = this.showFilterMenu.bind(this);
    this.listRowRenderer = this.listRowRenderer.bind(this);
    this.setFields = this.setFields.bind(this);
    this.setRowFields = this.setRowFields.bind(this);
    this.setColFields = this.setColFields.bind(this);
    this.onFiltersOk = this.onFiltersOk.bind(this);
    this.onFiltersCancel = this.onFiltersCancel.bind(this);
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

  listRowRenderer({ index, isScrolling, key, style }) {
    const { currentValues, currentFilter, filters } = this.state;

    return (
      <div
        key={currentValues[index]}
        className="filter-container"
        style={style}
      >
        <input
          onChange={this.addToFilters.bind(this, currentValues[index])}
          className="filter-checkbox"
          type="checkbox"
          defaultChecked={(filters[currentFilter] === undefined) ? false :
            filters[currentFilter].indexOf(currentValues[index]) !== -1}
        >
        </input>
        <div className='filter-name'>
          {currentValues[index]}
        </div>
      </div>
    );
  }

  displayFilter(fieldName) {
    const {
      pivot,
    } = this.state;

    pivot.getUniqueValues(fieldName);
  }

  addToFilters(filterValue) {
    const {
      currentFilter,
    } = this.state;

    const {
      filters,
    } = this.state;

    if (!(currentFilter in filters)) filters[currentFilter] = [];
    filters[currentFilter].indexOf(filterValue) === -1 ?
      filters[currentFilter].push(filterValue) :
      filters[currentFilter].splice(filters[currentFilter]
        .indexOf(filterValue), 1);

    this.setState({
      filters,
    });
  }

  onFiltersOk(all, checked, textFilter) {
    console.log('hello', all, checked, textFilter);
    const {
      currentFilter,
      filters,
    } = this.state;

    filters[currentFilter] = checked;

    this.setState({
      filters,
      currentFilter: '',
    });
  }

  onFiltersCancel() {
    console.log('cancel');
    this.setState({
      currentFilter: '',
    });
  }

  submitFilters() {
    const {
      colFields,
      filters,
      rowFields,
      selectedAggregationDimension,
      selectedAggregationType,
    } = this.state;

    // create new pivot and apply all filters. Because quick-pivot does not
    // account for removal of filters
    const newPivot = this.props.data !== undefined ?
      new QuickPivot(this.props.data, rowFields, colFields,
        selectedAggregationDimension || '', selectedAggregationType, '') :
      {};

    Object.keys(filters).forEach((filter) => {
      newPivot.filter((elem, index, array) => {
        return filters[filter].findIndex((field) => {
          return field === elem[filter];
        }) === -1;
      });
    });

    let headerCounter = 0;

    if (newPivot.data) {
      while (true) {
        if (newPivot.data.table) {
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

  render() {
    const {
      aggregationDimensions,
      colFields,
      columnCount,
      currentFilter,
      currentValues,
      data,
      fields,
      headerCounter,
      pivot,
      rowFields,
      selectedAggregationDimension,
      selectedAggregationType,
      columnWidth,
      headerHeight,
      overscanColumnCount,
      overscanRowCount,
      rowCount,
      rowHeight,
    } = this.state;

    const {
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
          currentValues={currentValues}
          listRowRenderer={this.listRowRenderer}
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
        />
        <div className="pivot-grid">
          <section className="pivot-grid">
            <Table
              collapsedRows={pivot.collapsedRows}
              originalArgs={pivot.originalArgs}
              rawData={pivot.data.rawData}
              onGridCellClick={onGridCellClick}
              onGridHeaderCellClick={onGridHeaderCellClick}
              onLeftGridCellClick={onLeftGridCellClick}
              onLeftHeaderCellClick={onLeftHeaderCellClick}
              colorPack={colorPack}
              headerHeight={headerHeight}
              rowHeight={rowHeight}
              headerCounter={headerCounter}
              columnWidth={columnWidth}
              overscanColumnCount={overscanColumnCount}
              overscanRowCount={overscanRowCount}
              data={data !== undefined ? data : [[]]}
              onToggleRow={this.onToggleRow}
              checkIfInCollapsed={this.checkIfInCollapsed}
              rowFields={rowFields}
              rowCount={rowCount}
              columnCount={columnCount}
            />
          </section>
        </div>
      </section>
    );
  }
}

Pivot.propTypes = {
  colorPack: PropTypes.object,
  data: PropTypes.array.isRequired,
  onGridCellClick: PropTypes.func,
  onGridHeaderCellClick: PropTypes.func,
  onLeftGridCellClick: PropTypes.func,
  onLeftHeaderCellClick: PropTypes.func,
  selectedAggregationDimension: PropTypes.string,
};

Pivot.defaultProps = {
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
