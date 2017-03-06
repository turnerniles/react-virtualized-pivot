import React from 'react';
import PivotMenu from './components/PivotMenu/PivotMenu.jsx'
import '../styles/index.scss';

export default class App extends React.Component {

  render () {
    const dataArray = [
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
    ];

    return (
      <div>
        <PivotMenu data={dataArray}></PivotMenu>
      </div>
    )
  }
}
