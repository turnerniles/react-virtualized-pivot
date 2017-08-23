/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class RightArrowIcon extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg
        fill={this.props.color}
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
      </svg>
    );
  }
}

RightArrowIcon.propTypes = {
  color: PropTypes.string,
};
