import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Drawer from './Drawer.jsx';

configure({ adapter: new Adapter() });

describe('A suite', function() {
  it('should render without throwing an error', function() {
    const wrapper = shallow(<Drawer />);

    expect(wrapper.find('.react-virtualized-pivot-module-menu')
      .length).toBe(1);
  });
  it('should be selectable by class "drawer-container"', function() {
    expect(shallow(<Drawer/>).is('.drawer-container')).toBe(true);
  });
});
