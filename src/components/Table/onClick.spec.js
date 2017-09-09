/* eslint-disable */
import onClick from './onClick';

describe('onClick', () => {
  const collapsedRows = {'12':{'table':[{'value':['Arya',10],'type':'data','depth':2,'row':13},{'value':['Sansa',12],'type':'data','depth':2,'row':14}],'rawData':[{'value':['Arya',[{'name':'Arya','gender':'f','house':'Stark','age':10}]],'type':'data','depth':2},{'value':['Sansa',[{'name':'Sansa','gender':'f','house':'Stark','age':12}]],'type':'data','depth':2}]}};
  const columnIndex = 0;
  const data = [{'value':['',''],'depth':0,'type':'colHeader','row':0},{'value':['Baratheon',56],'depth':0,'type':'rowHeader','row':1},{'value':['f',38],'depth':1,'type':'rowHeader','row':2},{'value':['Cersei',38],'type':'data','depth':2,'row':3},{'value':['m',18],'depth':1,'type':'rowHeader','row':4},{'value':['Joffrey',18],'type':'data','depth':2,'row':5},{'value':['Lannister',133],'depth':0,'type':'rowHeader','row':6},{'value':['m',133],'depth':1,'type':'rowHeader','row':7},{'value':['Jaime',32],'type':'data','depth':2,'row':8},{'value':['Tyrion',34],'type':'data','depth':2,'row':9},{'value':['Tywin',67],'type':'data','depth':2,'row':10},{'value':['Stark',44],'depth':0,'type':'rowHeader','row':11},{'value':['f',22],'depth':1,'type':'rowHeader','row':12},{'value':['m',22],'depth':1,'type':'rowHeader','row':15},{'value':['Bran',8],'type':'data','depth':2,'row':16},{'value':['Jon',14],'type':'data','depth':2,'row':17}];
  const headerCounter = 1;
  const originalArgs = {'data':[{'name':'Cersei','gender':'f','house':'Baratheon','age':38},{'name':'Joffrey','gender':'m','house':'Baratheon','age':18},{'name':'Jaime','gender':'m','house':'Lannister','age':32},{'name':'Tyrion','gender':'m','house':'Lannister','age':34},{'name':'Tywin','gender':'m','house':'Lannister','age':67},{'name':'Arya','gender':'f','house':'Stark','age':10},{'name':'Sansa','gender':'f','house':'Stark','age':12},{'name':'Bran','gender':'m','house':'Stark','age':8},{'name':'Jon','gender':'m','house':'Stark','age':14}],'rows':['house','gender','name'],'cols':[],'agg':'age','type':'sum','header':''};
  const rawData = [{'value':['',''],'depth':0,'type':'colHeader','row':0},{'value':['Baratheon',56],'depth':0,'type':'rowHeader'},{'value':['f',38],'depth':1,'type':'rowHeader'},{'value':['Cersei',[{'name':'Cersei','gender':'f','house':'Baratheon','age':38}]],'type':'data','depth':2},{'value':['m',18],'depth':1,'type':'rowHeader'},{'value':['Joffrey',[{'name':'Joffrey','gender':'m','house':'Baratheon','age':18}]],'type':'data','depth':2},{'value':['Lannister',133],'depth':0,'type':'rowHeader'},{'value':['m',133],'depth':1,'type':'rowHeader'},{'value':['Jaime',[{'name':'Jaime','gender':'m','house':'Lannister','age':32}]],'type':'data','depth':2},{'value':['Tyrion',[{'name':'Tyrion','gender':'m','house':'Lannister','age':34}]],'type':'data','depth':2},{'value':['Tywin',[{'name':'Tywin','gender':'m','house':'Lannister','age':67}]],'type':'data','depth':2},{'value':['Stark',44],'depth':0,'type':'rowHeader'},{'value':['f',22],'depth':1,'type':'rowHeader'},{'value':['m',22],'depth':1,'type':'rowHeader'},{'value':['Bran',[{'name':'Bran','gender':'m','house':'Stark','age':8}]],'type':'data','depth':2},{'value':['Jon',[{'name':'Jon','gender':'m','house':'Stark','age':14}]],'type':'data','depth':2}];
  const rowIndex = 10;

  const onGridCellClick = jest.fn();

  const children = [['Arya',10],['Sansa',12],['Bran',8],['Jon',14]];
  const childrenData = [['Arya',[{'name':'Arya','gender':'f','house':'Stark','age':10}]],['Sansa',[{'name':'Sansa','gender':'f','house':'Stark','age':12}]],['Bran',[{'name':'Bran','gender':'m','house':'Stark','age':8}]],['Jon',[{'name':'Jon','gender':'m','house':'Stark','age':14}]]];
  const columnHeaders = {};
  const rowHeaders = {house: 'Stark'};
  const expectedResults = {
    children,
    childrenData,
    columnHeaders,
    rowHeaders,
    columnIndex,
    rowIndex,
  };

  it('should call onGridCellClick with correct results', () => {
    onClick({collapsedRows, columnIndex, data, headerCounter, onGridCellClick, originalArgs, rawData, rowIndex});

    const actualResults = onGridCellClick.mock.calls[0][0];

    expect(onGridCellClick.mock.calls.length).toBe(1);
    expect(actualResults).toEqual(expectedResults);
  });
});
