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
});
