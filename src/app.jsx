import React from 'react';
import QuickPivot from './components/QuickPivot/QuickPivot.jsx';
import Papa from 'papaparse/papaparse.js';
import '../styles/index.scss';

export default class App extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
				data: [
         ['name', 'gender', 'house', 'age'],
         ['Jon', 'm', 'Stark', 14],
         ['Arya', 'f', 'Stark', 10],
         ['Cersei', 'f', 'Baratheon', 38],
         ['Tywin', 'm', 'Lannister', 67],
         ['Tyrion', 'm', 'Lannister', 34],
         ['Joffrey', 'm', 'Baratheon', 18],
         ['Bran', 'm', 'Stark', 8],
         ['Jaime', 'm', 'Lannister', 32],
         ['Sansa', 'f', 'Stark', 12],
       ],
    };

    this.handleFileSelect = this.handleFileSelect.bind(this);
  }

handleFileSelect(evt) {
  const file = evt.target.files[0];

  Papa.parse(file, {
    complete: (results) => {
      console.log(JSON.stringify(results.data))
      this.setState({data: results.data})
    }
  });
}

  render () {
    return (
      <div>
        <div className="app-menu" style={{'width': '100%', height: '50px'}}>
          <input
            type="file"
            onChange={this.handleFileSelect}
            style={{padding: '5px', width: '200px', display: 'inline-block', float: 'left'}}
          />
        </div>
        <QuickPivot data={this.state.data} selectedAggregationDimension={'age'}></QuickPivot>
      </div>
    )
  }
}
