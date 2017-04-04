import React, { PureComponent } from 'react'

import './styles.scss';

export default class FilterMenu extends PureComponent{
	constructor(props){
		super(props);

  }
  render() {
    const {
      displayFilter,
      filterMenuToDisplay,
      filterValues,
      field,
      submitFilters
    } = this.props;

    return (
      <section className="filter-menu-container">
  			{ filterMenuToDisplay[field] === true &&
  				<div className="filter-menu">
  				 {
  					(field in filterValues) ? filterValues[field].map((value, index) => {
  						return (
  							<div key={value}>
  								{value}
  							</div>
  						)
  					}) : ''
  				}
  				<div onClick={submitFilters}>Submit</div>
  			</div>
  		}
    </section>
    )
  }
}
