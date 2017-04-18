import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';
import App from './app.jsx';
import Pivot from './components/Pivot/Pivot.jsx';

describe('App', () => {

  it('should have a data state', () => {
    const wrapper = shallow(<App />);
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

    expect(wrapper.state('data')).to.deep.equal(data);
  });

  it('should render with a Pivot', () => {
    const wrapper = shallow(<App />);

    expect(wrapper.find(Pivot).length).to.equal(1);
  });
});