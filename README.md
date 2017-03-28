quick-pivot-ui
============

## About
quick-pivot-ui is a React.js pivot UI built on top of the [quick-pivot](https://github.com/pat310/quick-pivot) pivot library.

## Demo
https://turnerniles.github.io/react-quick-pivot-ui/

## Getting started

Install `quick-pivot-ui` using npm.

```shell
npm install quick-pivot-ui --save
```

## Usage
```jsx
import React from 'react';
import QuickPivot from 'quick-pivot-ui';

<QuickPivot
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
</QuickPivot>
```

## Contribute
Please contribute to the project, including this README.
