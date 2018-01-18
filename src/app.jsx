import React from 'react';
import Pivot from './components/Pivot/Pivot.jsx';
import Select from 'react-select';
import Papa from 'papaparse/papaparse.js';

import 'react-select/dist/react-select.css';
import '../styles/index.scss';

const data = require('./sampledata/data.js');

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: data.smallData,
      dataSize: 'small',
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
      colFields: ['name'],
      rowFields: ['gender'],
      onLeftGridCellClick: () => console.log('clicking leftHeader'), // eslint-disable-line no-console
      pivotOnChangeEnabled: true,
      pivotOnChangeFunction: (prevState) => {
        /* eslint-disable */
        const newState = prevState;
        newState.colFields=["name","house"];
        newState.filters={name: ["Cersei"]};
        console.log('new state', newState)
        return newState
      }
    };

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.onSelectData = this.onSelectData.bind(this);
    this.onSelectColorPack = this.onSelectColorPack.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  handleFileSelect(evt) {
    const file = evt.target.files[0];

    Papa.parse(file, {
      complete: (results) => {
        this.setState({data: results.data});
      },
    });
  }

  onSelectData(dataSize) {
    if (dataSize.value === 'small') {
      this.setState({
        dataSize: dataSize.value,
        data: data.smallData,
        isLoaded: true,
        selectedAggregationDimension: 'age',
        colFields: [],
        rowFields: [],
        pivotOnChangeFunction: (prevState) => {
          /* eslint-disable */
          const newState = prevState;
          newState.colFields=["name","house"];
          newState.filters={name: ["Cersei"]};
          console.log('new state', newState)
          return newState
        },
      });
    }
    if (dataSize.value === 'medium') {
      this.setState({
        dataSize: dataSize.value,
        data: data.mediumData,
        isLoaded: true,
        selectedAggregationDimension: 'Quantity',
        colFields: [],
        rowFields: [],
        pivotOnChangeFunction: undefined,
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
            selectedAggregationDimension: 'Amount Requested',
            isLoaded: true,
            colFields: [],
            rowFields: [],
            pivotOnChangeFunction: undefined,
          });
        },
      });
    }
  }

  onButtonClick() {
    this.setState({
      onLeftHeaderCellClick: function(){console.log('Changes OnClick')},
    });
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
        <div className="app-menu" style={{ 'width': '100%' }}>
          <button onClick={this.onButtonClick}>Pass</button>
          <div className='select-container'>
            <div
              className="title"
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
              name="Dataset"
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
          <div className="input">
            <input
              type="file"
              onChange={this.handleFileSelect}
              style={{padding: '5px', width: '200px',
                display: 'inline-block'}}
            />
          </div>
        </div>
        <Pivot
          colFields={this.state.colFields}
          rowFields={this.state.rowFields}
          onChange={this.state.pivotOnChangeFunction}
          colorPack={colorPack}
          data={data}
          filters={{name: ['Arya', 'Jon']}}
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
          onLeftHeaderCellClick={this.state.onLeftHeaderCellClick} // eslint-disable-line no-console
          rowTotals={true}
          selectedAggregationDimension={selectedAggregationDimension}
        />
      </section>
    );
  }
}
