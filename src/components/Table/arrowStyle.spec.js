/* eslint-disable max-len */
import arrowStyle from './arrowStyle';

describe('arrowStyle', () => {
  const data = JSON.parse('[{"value":["",""],"depth":0,"type":"colHeader","row":0},{"value":["f",60],"depth":0,"type":"rowHeader","row":1},{"value":["Arya",10],"type":"data","depth":1,"row":2},{"value":["Cersei",38],"type":"data","depth":1,"row":3},{"value":["Sansa",12],"type":"data","depth":1,"row":4},{"value":["m",173],"depth":0,"type":"rowHeader","row":5}]');
  const headerCounter = 1;

  function checkIfInCollapsed(index) {
    if (index === 5) return true;
    return false;
  }

  it('should return collapsed error if in collapsed', () => {
    const result = arrowStyle({
      checkIfInCollapsed,
      data,
      headerCounter,
      rowFields: ['gender', 'name'],
      colFields: [],
      rowIndex: 5,
    });

    expect(result).toBe('►');
  });

  it('should return dropdown arrow if row is uncollapsed', () => {
    const result = arrowStyle({
      checkIfInCollapsed,
      data,
      headerCounter,
      rowFields: ['gender', 'name'],
      colFields: [],
      rowIndex: 0,
    });

    expect(result).toBe('▼');
  });

  it('should not return an arrow if not a rowHeader', () => {
    const result = arrowStyle({
      checkIfInCollapsed,
      data,
      headerCounter,
      rowFields: ['gender', 'name'],
      colFields: [],
      rowIndex: 1,
    });

    expect(result).toBe('');
  });

  it('should have dropdown arrows if there are no rowFields and there are multiple column fields', () => {
    const dataNoRowHeaders = JSON.parse('[{"value":["","f","f","f","m","m","m","m","m","m"],"depth":0,"type":"colHeader","row":0},{"value":["","Arya","Cersei","Sansa","Bran","Jaime","Joffrey","Jon","Tyrion","Tywin"],"depth":1,"type":"colHeader","row":1},{"value":["f",10,38,12,"","","","","",""],"depth":0,"type":"rowHeader","row":2},{"value":["Arya",10,"","","","","","","",""],"type":"data","depth":1,"row":3},{"value":["Cersei","",38,"","","","","","",""],"type":"data","depth":1,"row":4},{"value":["Sansa","","",12,"","","","","",""],"type":"data","depth":1,"row":5},{"value":["m","","","",8,32,18,14,34,67],"depth":0,"type":"rowHeader","row":6}]');
    const headerCounterNoRows = 2;
    const result = arrowStyle({
      checkIfInCollapsed,
      data: dataNoRowHeaders,
      headerCounter: headerCounterNoRows,
      rowFields: [],
      colFields: ['gender', 'name'],
      rowIndex: 0,
    });

    expect(result).toBe('▼');
  });
});
