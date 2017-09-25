import React, { PureComponent } from 'react';
import './styles.scss';

export default class Drawer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      handleRightClose,
      isDrawerOpen,
    } = this.props;

    return (
      <div
        className={['drawer-container', isDrawerOpen ? 'nav-drawer_open' : '',
          'react-virtualized-pivot-module-menu'].join(' ')}
      >
        <div
          className="drawer-overlay"
          onClick={handleRightClose}
        >
        </div>
        <section
          className="drawer"
        >
          {this.props.children}
        </section>
      </div>
    );
  }
}
