import React from 'react';
import QuickPivot from './components/QuickPivot/QuickPivot.jsx';
import Papa from 'papaparse/papaparse.js';
import '../styles/index.scss';
import demoData from './demodata.jsx'

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
      this.setState({data: results.data})
    }
  });
}

  render () {
    return (
      <div>
        <input style={{padding: '5px'}} type="file" onChange={this.handleFileSelect}/>
        <QuickPivot data={this.state.data}></QuickPivot>
      </div>
    )
  }
}
