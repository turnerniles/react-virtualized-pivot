import React from 'react';
import { shallow } from 'enzyme';
import Drawer from './Drawer.jsx';

it('should render without throwing an error', function() {
  const wrapper = shallow(<Drawer />);
  const container = wrapper.find(
    <div className="drawer-container react-virtualized-pivot-module-menu"></div>
  );

  expect(container.root.length).toBe(1);
});

it('should be selectable by class "drawer-container"', function() {
  expect(shallow(<Drawer/>).is('.drawer-container')).toBe(true);
});
