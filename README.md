react-virtualized-pivot
============

## About
react-virtualized-pivot is a React.js pivot UI built on top of [react-virtualized](https://github.com/bvaughn/react-virtualized) and [quick-pivot](https://github.com/pat310/quick-pivot).

## Demo
https://turnerniles.github.io/react-virtualized-pivot/

## Getting started

Install `react-virtualized-pivot` using npm.

```shell
npm install react-virtualized-pivot --save
```

## Usage
```jsx
import React from 'react';
import Pivot from 'react-virtualized-pivot';

<Pivot
  data = [
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
  ]
>
</Pivot>
```

## Contribute
Please contribute to the project, including this README.
