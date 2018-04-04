import React from 'react';
import Pivot from './components/Pivot/Pivot.jsx';
import Select from 'react-select';
import Papa from 'papaparse/papaparse.js';
import App from './app.jsx';
import ReactDOM from 'react-dom';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App/>, div);
    });
    it('should format seconds', () => {
      const clock = shallow(<App/>);
      let evt = {};
      evt.target = {};
      evt.target.value = 'true';
      const actual = clock.instance().testFunc();

      expect(actual).toBe(true);
  });
/*
  toggleUserData(evt) {
    if (evt.target.value === 'true') {
      this.setState({useSampleData: true, data: data.smallData});
    } else {
      this.setState({useSampleData: false, data: [[]]});
    }
  }
  //*/
  it('should reset State', () => {
    const clock = shallow(<App/>);
    let evt = {};
    evt.target = {};
    evt.target.value = 'false';

      expect(clock.state('useSampleData')).toEqual(true);

    clock.instance().toggleUserData(evt);
      expect(clock.state('useSampleData')).toEqual(false);

    //expect(actual).toBe(true);
  });
  it('should update state and dump data when radio button is toggled', () => {
    const clock = shallow(<App/>);
    expect(clock.state('useSampleData')).toEqual(true);

    clock.find('input[type="radio"][id="custom"]').simulate('change',{ target: { value: 'false' } });
    expect(clock.state('useSampleData')).toEqual(false);
    expect(clock.state('data')).toEqual([[]]);
  });



});
