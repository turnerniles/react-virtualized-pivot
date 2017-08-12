import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';

import './styles.scss';

export default class Menu extends PureComponent {
	constructor(props) {
		super(props);

    this.state = {
      isDrawerOpen: false,
    };

    this.handleRightOpen = this.handleRightOpen.bind(this);
    this.handleRightClose = this.handleRightClose.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
	}

  handleRightOpen () {
    this.toggleDrawer(true)
  };

  handleRightClose() {
    this.toggleDrawer(false)
  };

  toggleDrawer(open) {
    this.setState({ isDrawerOpen: open });
  };

	render() {
    const sideList = (
      <div>
        hello
      </div>
    );

		return(
			<section className="menu">
        <Button onClick={this.handleRightOpen}>Open Right</Button>
        <Drawer
          anchor="right"
          open={this.state.isDrawerOpen}
          onRequestClose={this.handleRightClose}
          onClick={this.handleRightClose}
        >
          {sideList}
        </Drawer>
			</section>
		);
	}
}

Menu.propTypes = {

}

Menu.defaultProps = {
}
