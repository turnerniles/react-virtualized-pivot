import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import App from './app.jsx';

describe('root', () => {
  it('should pass', () => {
    expect(1).to.equal(1);
  });

  it('should also pass', () => {
    expect(2).to.equal(2);
  });
});