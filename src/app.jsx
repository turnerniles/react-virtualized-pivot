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
      },
    };

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.onSelectData = this.onSelectData.bind(this);
    this.onSelectColorPack = this.onSelectColorPack.bind(this);
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
      });
    }
    if (dataSize.value === 'medium') {
      this.setState({
        dataSize: dataSize.value,
        data: data.mediumData,
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
        },
      })
    }
    if (colorPack.value === 'funky') {
      this.setState({
        selectedColorPack: colorPack.value,
        colorPack: {
          columnResizer: '#e0e0e0',
          sortableFieldBackground: '#5F9EDF',
          sortableFieldText: '#fff',
          sortableContainerBackground: '#fff',
          sortableContainerBorderColor: '#ccc',
          selectorContainerTitleBackground: '#FF7373',
          selectorContainerTitleText: '#fff',
          leftHeaderCellBackground: 'rgb(51, 51, 51)',
          leftHeaderCellText: '#fff',
          headerGridBackground: 'rgb(51, 51, 51)',
          headerGridText: '#fff',
          leftSideGridBackground: 'rgb(188, 57, 89)',
          leftSideGridText: '#fff',
          bodyGridBackground: 'rgb(120, 54, 70)',
          bodyGridText: '#fff',
          evenRowBackground: '',
          oddRowBackground: 'rgba(0, 0, 0, .1)',
          gridBorders: '#e0e0e0',
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
      <div>
        <div
          className="loader"
          style={{'display': isLoaded ? 'none' : 'inherit'}}
        >
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
        <div className="app-menu" style={{'width': '100%', height: '50px'}}>
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
                { value: 'funky', label: 'funky' },
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
          colorPack={colorPack}
          data={data}
          onGridCellClick={({rowIndex, columnIndex, children, childrenData, rowHeaders, columnHeaders}) => console.log('grid', rowIndex, columnIndex, children, childrenData, rowHeaders, columnHeaders)}
          onGridHeaderCellClick={({rowIndex, columnIndex}) => console.log('header', rowIndex, columnIndex)}
          onLeftGridCellClick={({rowIndex, columnIndex, children, childrenData, rowHeaders}) => console.log('left grid', rowIndex, columnIndex, children, childrenData, rowHeaders)}
          onLeftHeaderCellClick={() => console.log('clicking leftHeader')}
          selectedAggregationDimension={selectedAggregationDimension}
        />
      </div>
    );
  }
}
