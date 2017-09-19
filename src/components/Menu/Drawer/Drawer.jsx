import React, { PureComponent } from 'react';

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
        className={['container', isDrawerOpen ? 'nav-drawer_open' : '',
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
          <main
            className="content"
          >
            <header>
              <nav>
                {this.props.children}
              </nav>
            </header>
          </main>
        </section>
      </div>
    );
  }
}
