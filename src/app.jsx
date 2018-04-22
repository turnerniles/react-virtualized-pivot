import React from 'react';
import Pivot from './components/Pivot/Pivot.jsx';
import Select from 'react-select';
import Papa from 'papaparse/papaparse.js';
import ToggleDisplay from 'react-toggle-display';

import 'react-select/dist/react-select.css';
import '../styles/index.scss';

const data = require('./sampledata/data.js');

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: data.smallData,
      headerRow: data.smallData[0],
      dataSize: 'small',
      useSampleData: true,
      showEditHeaderForm: false,
      showAddHeaderForm: false,
      validationMessage: null,
      selectedAggregationDimension: 'age',
      isLoaded: true,
      selectedColorPack: 'standard',
      colorPack: {
        columnResizer: '#e0e0e0',
        sortableFieldBackground: '#fafafa',
        sortableFieldText: '#000',
        sortableContainerBackground: '#fff',
        sortableContainerBorderColor: '#ccc',
        selectorContainerTitleBackground: '#fafafa',
        selectorContainerTitleText: '#000',
        leftHeaderCellBackground: '#fafafa',
        leftHeaderCellText: '#000',
        headerGridBackground: '#fafafa',
        headerGridText: '#000',
        leftSideGridBackground: '#fff',
        leftSideGridText: '#000',
        bodyGridBackground: '#fff',
        bodyGridText: '#000',
        evenRowBackground: '#fff',
        oddRowBackground: '#fafafa',
        gridBorders: '#e0e0e0',
        icons: '#ccc',
      },
    };

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.onSelectData = this.onSelectData.bind(this);
    this.onSelectColorPack = this.onSelectColorPack.bind(this);
    this.toggleUserData = this.toggleUserData.bind(this);
    this.editHeader = this.editHeader.bind(this);
    this.saveNewHeaders = this.saveNewHeaders.bind(this);
    this.showHeaderDialog = this.showHeaderDialog.bind(this);
    this.cancelEditDialog = this.cancelEditDialog.bind(this);
  }

  handleFileSelect(evt) {
    const file = evt.target.files[0];

    Papa.parse(file, {
      complete: (results) => {
        this.setState({data: results.data, headerRow: results.data[0]});
      },
    });
  }

  toggleUserData(evt) {
    if (evt.target.value === 'true') {
      this.setState({useSampleData: true, data: data.smallData});
    } else {
      this.setState({useSampleData: false, data: [[]]});
    }
  }

  showHeaderDialog(e) {
    const editType = e.target.value;

    if (editType === 'editHeaders') {
      this.setState({showEditHeaderForm: true, showAddHeaderForm: false,
        headerRow: this.state.data[0]});
    } else if (editType === 'addHeaders') {
      const blankHeaderRow = [];

      this.state.data[0].forEach(header => {
        blankHeaderRow.push(null);
      });
      this.setState({showAddHeaderForm: true, showEditHeaderForm: false,
        headerRow: blankHeaderRow});
    }
  }

  cancelEditDialog() {
    this.setState({showEditHeaderForm: false, showAddHeaderForm: false,
      headerRow: this.state.data[0], validationMessage: null});
  }

  saveNewHeaders() {
    const newDataSet = this.state.data.slice();

    let validHeaders = true;

    this.state.headerRow.forEach(header => {
      if (header === null || header === '') {
        validHeaders = false;
      }
    });
    if (validHeaders === false) {
      this.setState({validationMessage: 'Headers cannot be blank.'});
    } else {
      if (this.state.showAddHeaderForm === true) {
        newDataSet.unshift(this.state.headerRow);
        this.setState({data: newDataSet, showAddHeaderForm: false,
          validationMessage: null});
      } else {
        newDataSet[0] = this.state.headerRow;
        this.setState({data: newDataSet, showEditHeaderForm: false,
          validationMessage: null});
      }
    }
  }

  editHeader(evt) {
    const id = evt.target.id;
    const value = evt.target.value;
    const newHeaderRow = this.state.headerRow.slice();

    newHeaderRow[id] = value;

    this.setState({headerRow: newHeaderRow});
  }

  onSelectData(dataSize) {
    if (dataSize.value === 'small') {
      this.setState({
        dataSize: dataSize.value,
        data: data.smallData,
        headerRow: data.smallData[0],
        isLoaded: true,
        selectedAggregationDimension: 'age',
      });
    }
    if (dataSize.value === 'medium') {
      this.setState({
        dataSize: dataSize.value,
        data: data.mediumData,
        headerRow: data.mediumData[0],
        isLoaded: true,
        selectedAggregationDimension: 'Quantity',
      });
    }
    if (dataSize.value === 'large') {
      this.setState({
        dataSize: dataSize.value,
        isLoaded: false,
      });
      Papa.parse('https://raw.githubusercontent.com/turnerniles/' +
        'react-virtualized-pivot/master/src/sampledata/RejectStatsA.csv', {
        download: true,
        complete: (results) => {
          this.setState({
            data: results.data,
            headerRow: results.data[0],
            selectedAggregationDimension: 'Amount Requested',
            isLoaded: true,
          });
        },
      });
    }
  }

  onSelectColorPack(colorPack) {
    if (colorPack.value === 'standard') {
      this.setState({
        selectedColorPack: colorPack.value,
        colorPack: {
          columnResizer: '#e0e0e0',
          sortableFieldBackground: '#fafafa',
          sortableFieldText: '#000',
          sortableContainerBackground: '#fff',
          sortableContainerBorderColor: '#ccc',
          selectorContainerTitleBackground: '#fafafa',
          selectorContainerTitleText: '#000',
          leftHeaderCellBackground: '#fafafa',
          leftHeaderCellText: '#000',
          headerGridBackground: '#fafafa',
          headerGridText: '#000',
          leftSideGridBackground: '#fff',
          leftSideGridText: '#000',
          bodyGridBackground: '#fff',
          bodyGridText: '#000',
          evenRowBackground: '#fff',
          oddRowBackground: '#fafafa',
          gridBorders: '#e0e0e0',
          icons: '#ccc',
        },
      });
    }
    if (colorPack.value === 'fuschia') {
      this.setState({
        selectedColorPack: colorPack.value,
        colorPack: {
          columnResizer: '#e0e0e0',
          sortableFieldBackground: '#fafafa',
          sortableFieldText: '#000',
          sortableContainerBackground: '#fff',
          sortableContainerBorderColor: '#ccc',
          selectorContainerTitleBackground: 'rgb(188, 57, 89)',
          selectorContainerTitleText: '#fff',
          leftHeaderCellBackground: '#333',
          leftHeaderCellText: '#fff',
          headerGridBackground: '#333',
          headerGridText: '#fff',
          leftSideGridBackground: 'rgb(188, 57, 89)',
          leftSideGridText: '#fff',
          bodyGridBackground: '#783646',
          bodyGridText: '#fff',
          evenRowBackground: '',
          oddRowBackground: 'rgba(0, 0, 0, .1)',
          gridBorders: '#e0e0e0',
          icons: '#fff',
        },
      });
    }
    if (colorPack.value === 'forest-green') {
      this.setState({
        selectedColorPack: colorPack.value,
        colorPack: {
          columnResizer: '#e0e0e0',
          sortableFieldBackground: '#fafafa',
          sortableFieldText: '#000',
          sortableContainerBackground: '#fff',
          sortableContainerBorderColor: '#ccc',
          selectorContainerTitleBackground: '#3e7360',
          selectorContainerTitleText: '#fff',
          leftHeaderCellBackground: '#285847',
          leftHeaderCellText: '#fff',
          headerGridBackground: '#285847',
          headerGridText: '#fff',
          leftSideGridBackground: '#164A38',
          leftSideGridText: '#fff',
          bodyGridBackground: '#073323',
          bodyGridText: '#fff',
          evenRowBackground: '',
          oddRowBackground: 'rgba(0, 0, 0, .2)',
          gridBorders: '#e0e0e0',
          icons: '#5e8D7c',
        },
      });
    }
  }

  render() {
    const {
      data,
      dataSize,
      isLoaded,
      selectedAggregationDimension,
      colorPack,
      selectedColorPack,
    } = this.state;

    return (
      <section className='react-virtualized-pivot-demo'>
        <a
          href="https://github.com/turnerniles/react-virtualized-pivot"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="github-fork"
            // eslint-disable-next-line
            src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            alt="Fork me on GitHub"
          />
        </a>
        <div
          className="loader"
          style={{'display': isLoaded ? 'none' : 'inherit'}}
        >
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
        <div className='toggle-user-data'>
          <input type="radio" value="true" id="default"
            onChange={this.toggleUserData}
            defaultChecked name="dataUsed"/> Use Sample Dataset
          <br/>
          <input type="radio" value="false" id="custom"
            onChange={this.toggleUserData}
            name="dataUsed"/> Use My Own Dataset
        </div>
        <div className="app-menu" style={{ 'width': '100%' }}>
          <div className='select-container'>
            <div
              className="title"
              style={{
                'backgroundColor': colorPack.selectorContainerTitleBackground,
                'color': colorPack.selectorContainerTitleText,
              }}
            >
              Color Pack
            </div>
            <Select
              name="ColorPack"
              value={selectedColorPack}
              options={[
                { value: 'standard', label: 'standard' },
                { value: 'forest-green', label: 'forest green' },
                { value: 'fuschia', label: 'fuschia' },
              ]}
              onChange={this.onSelectColorPack}
              menuContainerStyle={{
                zIndex: 2,
              }}
              clearable={false}
            />
          </div>
          <ToggleDisplay if = {this.state.useSampleData}>
            <div className='select-container'>
              <div className="title"
                style={{
                  'backgroundColor': colorPack.selectorContainerTitleBackground,
                  'color': colorPack.selectorContainerTitleText,
                }}
              >
                Dataset Select
              </div>
              <Select
                name="Dataset"
                value={dataSize}
                options={[
                  { value: 'small', label: 'small' },
                  { value: 'medium', label: 'medium' },
                  { value: 'large', label: 'large' },
                ]}
                onChange={this.onSelectData}
                menuContainerStyle={{
                  zIndex: 2,
                }}
                clearable={false}
              />
            </div>
          </ToggleDisplay>
          <ToggleDisplay if = {!this.state.useSampleData}>
            <div className = "input-dialog">
              <input type="file"
                onChange={this.handleFileSelect}
                accept=".csv, .tsv"
              />
            </div>
          </ToggleDisplay>
        </div>
        <ToggleDisplay if = {!this.state.useSampleData}>
          <div className = "input-dialog">
            Dataset Headers ({data[0].length}):
            <br />
            {data[0].join(', ')}
            <ToggleDisplay if={(this.state.showEditHeaderForm === false) &&
              (data.length > 1) &&
              (this.state.showAddHeaderForm === false)}>
              <button className="button" style={{marginLeft: '15px'}}
                value="editHeaders" onClick={this.showHeaderDialog}>
                Edit Headers
              </button>
              <button value="addHeaders"
                className="button"
                onClick={this.showHeaderDialog}>
                Oops, I Need To Add My Headers!
              </button>
            </ToggleDisplay>
            <div>
              <ToggleDisplay if={this.state.showEditHeaderForm === true}>
                {this.state.headerRow.map(function(headerName, index) {
                  return (
                    <span key = {index}>
                      <input id = {index} value = {headerName}
                        className="input-text"
                        onChange={this.editHeader}
                        type = "text"/>
                    </span>
                  );
                }, this)}
                <button className = "button" value="cancelEditDialog"
                  onClick={this.cancelEditDialog}> Cancel </button>
                <button className = "button" value="saveEditedHeaders"
                  onClick={this.saveNewHeaders}> Save </button>
              </ToggleDisplay>
              <ToggleDisplay if={this.state.showAddHeaderForm === true}>
                <span style={{fontSize: 'small'}}>
                  <span className = "important-message">Important! </span>
                  This will append a new Header row to the top of your dataset.
                </span>
                <br/>
                {this.state.headerRow.map(function(headerName, index) {
                  return (
                    <span key = {index}>
                      <input id = {index}
                        className="input-text"
                        onChange={this.editHeader}
                        type = "text"/>
                    </span>
                  );
                }, this)}
                <button className = "button" value="cancelAddDialog"
                  onClick={this.cancelEditDialog}>
                  Cancel
                </button>
                <button className = "button" value="saveAddedHeaders"
                  onClick={this.saveNewHeaders}>
                  Create New Header Row
                </button>
              </ToggleDisplay>
              <span className = "important-message">
                {this.state.validationMessage}
              </span>
            </div>
          </div>
        </ToggleDisplay>
        <Pivot
          colorPack={colorPack}
          colTotals={false}
          data={data}
          onGridCellClick={({
            rowIndex,
            columnIndex,
            children,
            childrenData,
            rowHeaders,
            columnHeaders,
          }) => {
            console.log('grid'); // eslint-disable-line no-console
            console.log('rowIndex', rowIndex); // eslint-disable-line no-console
            console.log('columnIndex', columnIndex); // eslint-disable-line no-console
            console.log('children', children); // eslint-disable-line no-console
            console.log('childrenData', childrenData); // eslint-disable-line no-console
            console.log('rowHeaders', rowHeaders); // eslint-disable-line no-console
            console.log('columnHeaders', columnHeaders); // eslint-disable-line no-console
          }}
          onGridHeaderCellClick={({
            rowIndex,
            columnIndex,
          }) => {
            console.log('header', rowIndex, columnIndex); // eslint-disable-line no-console
          }}
          onLeftGridCellClick={({
            rowIndex,
            columnIndex,
            children,
            childrenData,
            rowHeaders,
          }) => {
            console.log('leftGrid'); // eslint-disable-line no-console
            console.log('rowIndex', rowIndex); // eslint-disable-line no-console
            console.log('columnIndex', columnIndex); // eslint-disable-line no-console
            console.log('children', children); // eslint-disable-line no-console
            console.log('childrenData', childrenData); // eslint-disable-line no-console
            console.log('rowHeaders', rowHeaders); // eslint-disable-line no-console
          }}
          onLeftHeaderCellClick={() => console.log('clicking leftHeader')} // eslint-disable-line no-console
          rowTotals={false}
          selectedAggregationDimension={selectedAggregationDimension}
        />
      </section>
    );
  }
}
