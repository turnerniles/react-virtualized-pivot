react-virtualized-pivot
============

## About
react-virtualized-pivot is a React.js pivot UI built on top of [react-virtualized](https://github.com/bvaughn/react-virtualized) and [quick-pivot](https://github.com/pat310/quick-pivot).

## Demo
https://turnerniles.github.io/react-virtualized-pivot/

The demo uses ~24.7mb uncompressed .csv, 269,372 rows by 9 columns (2,424,348 cells) of 2007-2012 Declined Loan data provided by [Lending Club](https://www.lendingclub.com/info/download-data.action).

## Getting started

Install `react-virtualized-pivot` using npm.

```shell
npm install react-virtualized-pivot --save
```

## Usage
```jsx
import React from 'react';
import Pivot from 'react-virtualized-pivot';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-virtualized-pivot/docs/umd/styles.css';

<Pivot
  data={[
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
  ]}
/>
```

## Props
`<Pivot>` accepts the following props:
* `data` (**required**)
  * An array of arrays (first array will be your column headers)
  * An array of objects (keys of the object are your column headers)
* `colorPack`
  * An object with components to adjust colors of as keys and the corresponding color as a string. The following components are available for color selection (shown with their default selection):
    * columnResizer: '#e0e0e0'
    * sortableFieldBackground: '#fafafa'
    * sortableFieldText: '#000'
    * sortableContainerBackground: '#fff'
    * sortableContainerBorderColor: '#ccc'
    * selectorContainerTitleBackground: '#fafafa'
    * selectorContainerTitleText: '#000'
    * leftHeaderCellBackground:'#fafafa'
    * leftHeaderCellText:'#000'
    * headerGridBackground:'#fafafa'
    * headerGridText:'#000'
    * leftSideGridBackground: '#fff'
    * leftSideGridText:'#000'
    * bodyGridBackground: '#fff'
    * bodyGridText:'#000'
    * evenRowBackground: '#fff'
    * oddRowBackground: '#fafafa'
    * gridBorders: '#e0e0e0'
* `onGridCellClick`
  * A function that is fired when clicking on a grid cell. The function provides an object as a parameter with the following properties:
    * rowIndex: the row index of the cell clicked
    * columnIndex: the column index of the cell clicked
    * children: all the children values of the cell clicked
    * childrenData: all the children data points that make up the cell clicked
    * rowHeaders: all the parent row headers above the current clicked cell and at the current cell
    * columnHeaders: all the column headers at the clicked cell
* `onGridHeaderCellClick`
  * A function that is fired when clicking on a column header. The function provides an object as a parameter with the following properties:
    * rowIndex: the row index of the column header clicked
    * columnIndex: the column index of the column header clicked
* `onLeftGridCellClick`
  * A function that is fired when clicking on a row header (the left hand column). The function provides an object as a parameter with the following properties:
    * rowIndex: the row index of the row header cell clicked
    * columnIndex: the column index of the row header cell clicked
    * children: all the children values of the row header cell clicked
    * childrenData: all the children data points that make up the row header cell clicked
    * rowHeaders: all the parent row headers above the current clicked row header cell and at the current cell
* `onLeftHeaderCellClick`
  * A function that is fired when clicking on the top left most cell (above the row headers and to the left of the column headers)

## Example usage with optional props
```jsx
import React from 'react';
import Pivot from 'react-virtualized-pivot';
import 'react-virtualized-pivot/docs/umd/styles.css';

const data = [
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
const colorPack = {
  columnResizer: '#e0e0e0',
  sortableFieldBackground: '#fafafa',
  sortableFieldText: '#000',
  sortableContainerBackground: '#fff',
  sortableContainerBorderColor: '#ccc',
  selectorContainerTitleBackground: '#fafafa',
  selectorContainerTitleText: '#000',
  leftHeaderCellBackground:'#fafafa',
  leftHeaderCellText:'#000',
  headerGridBackground:'#fafafa',
  headerGridText:'#000',
  leftSideGridBackground: '#fff',
  leftSideGridText:'#000',
  bodyGridBackground: '#fff',
  bodyGridText:'#000',
  evenRowBackground: '#fff',
  oddRowBackground: '#fafafa',
  gridBorders: '#e0e0e0',
};

function onGridCellClick({rowIndex, columnIndex, children, childrenData, rowHeaders, columnHeaders}) {
  console.log('clicked on body cell');
  console.log('rowIndex', rowIndex);
  console.log('columnIndex', columnIndex);
  console.log('children', children);
  console.log('childrenData', childrenData);
  console.log('rowHeaders', rowHeaders);
  console.log('columnHeaders', columnHeaders);
}

function onLeftGridCellClick({rowIndex, columnIndex, children, childrenData, rowHeaders, columnHeaders}) {
  console.log('clicked on a left row header');
  console.log('rowIndex', rowIndex);
  console.log('columnIndex', columnIndex);
  console.log('children', children);
  console.log('childrenData', childrenData);
  console.log('rowHeaders', rowHeaders);
  console.log('columnHeaders', columnHeaders);
}

function onGridHeaderCellClick({rowIndex, columnIndex}) {
  console.log('clicked on column header');
  console.log('rowIndex', rowIndex);
  console.log('columnIndex', columnIndex);
}

function onLeftHeaderCellClick() {
  console.log('clicked on the top left corner cell');
}

<Pivot
  data={data}
  colorPack={colorPack}
  onGridCellClick={onGridCellClick}
  onLeftGridCellClick={onLeftGridCellClick}
  onGridHeaderCellClick={onGridHeaderCellClick}
  onLeftHeaderCellClick={onLeftHeaderCellClick}
/>
```

## Contribute
Please contribute to the project, including this README.
