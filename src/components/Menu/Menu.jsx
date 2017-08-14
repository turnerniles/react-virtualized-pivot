import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import Select from 'react-select';
import ReactSortable from '../CustomReactSortable/CustomReactSortable.jsx';

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
		const{
			colorPack,
			selectedAggregationType,
			aggregationTypes,
			onSelectAggregationType,
			selectedAggregationDimension,
			aggregationDimensions,
			onSelectAggregationDimension,
			fields,
			currentValues,
			listRowRenderer,
			submitFilters,
			showFilterMenu,
			colFields,
			rowFields,
		} = this.props;

		//We are not using deconstructed state consts here due to
		// react-sortablejs bug
		const fieldsRenderer = fields.length ? fields.map((field, index) =>
			{ return (
				<li
					key={index}
					data-id={field}
					style={{
						backgroundColor: colorPack.sortableFieldBackground,
						color: colorPack.sortableFieldText
					}}
				>
					{(currentValues.length > 0 && currentFilter === field) &&
						<div
							className="filter-menu"
							style={{display: currentValues.length > 0 ? 'inline-block' : 'none'}}>
							<div className="filters-container">
								<List
									ref='List'
									className={'virtualized-list'}
									height={80}
									overscanRowCount={10}
									rowCount={currentValues.length}
									rowHeight={20}
									rowRenderer={listRowRenderer}
									width={100}
								/>
							</div>
						<div onClick={submitFilters} className="filter-submit">Submit</div>
					</div>
					}
				<div className="inner-filter-container">
					<div className="filter-text">
					{field}
					</div>
					<div
						className="filter-button"
						onClick={showFilterMenu.bind(this, field)}
					>
						✎
					</div>
				</div>
			</li>
			)}
		) : ''
		const rowFieldsRender = rowFields.map((field, index) =>
			(
				<li
					key={index}
					data-id={field}
					style={{
						backgroundColor: colorPack.sortableFieldBackground,
						color: colorPack.sortableFieldText
					}}
				>
				<div className="inner-filter-container">
					<div className="filter-text">
					{field}
					</div>
					<div
						className="filter-button"
						onClick={showFilterMenu.bind(this, field)}
					>
						✎
					</div>
				</div>
				{(currentValues.length > 0 && currentFilter === field) &&
					<div
						className="filter-menu"
						style={{display: currentValues.length > 0 ? 'inline-block' : 'none'}}>
						<div className="filters-container">
							<List
								ref='List'
								className={'virtualized-list'}
								height={80}
								overscanRowCount={10}
								rowCount={currentValues.length}
								rowHeight={20}
								rowRenderer={listRowRenderer}
								width={100}
							/>
						</div>
					<div onClick={submitFilters} className="filter-submit">Submit</div>
				</div>
				}
			</li>
		));

		const colFieldsRender = colFields.map((field, index) =>
			(
				<li
					key={index}
					data-id={field}
					style={{
						backgroundColor: colorPack.sortableFieldBackground,
						color: colorPack.sortableFieldText
					}}
				>
				<div className="inner-filter-container">
					<div className="filter-text">
					{field}
					</div>
					<div
						className="filter-button"
						onClick={showFilterMenu.bind(this, field)}
					>
						✎
					</div>
				</div>
				{(currentValues.length > 0 && currentFilter === field) &&
					<div
						className="filter-menu"
						style={{display: currentValues.length > 0 ? 'inline-block' : 'none'}}>
						<div className="filters-container">
							<List
								ref='List'
								className={'virtualized-list'}
								height={80}
								overscanRowCount={10}
								rowCount={currentValues.length}
								rowHeight={20}
								rowRenderer={listRowRenderer}
								width={100}
							/>
						</div>
					<div onClick={submitFilters} className="filter-submit">Submit</div>
				</div>
				}
			</li>
		));

    const menuItems = (
			<div className="pivot-options">
			 <div className="selectors-container">
					<div className="select-container">
					<div
						className="title"
						style={{
							'backgroundColor': colorPack.selectorContainerTitleBackground,
							'color': colorPack.selectorContainerTitleText,
						}}
					>
						Aggregation Type
					</div>
						<Select
								name="Aggregation Type"
								value={selectedAggregationType}
								options={aggregationTypes}
								onChange={onSelectAggregationType}
								menuContainerStyle={{ zIndex: 2 }}
								clearable={false}
						/>
				</div>

				<div className="select-container">
					<div
						className="title"
						style={{
							'backgroundColor': colorPack.selectorContainerTitleBackground,
							'color': colorPack.selectorContainerTitleText,
						}}
					>
						Aggregation Dimension
					</div>
						<Select
								name="Aggregation Type"
								value={selectedAggregationDimension}
								options={aggregationDimensions}
								onChange={onSelectAggregationDimension}
								menuContainerStyle={{ zIndex: 2 }}
								clearable={false}
						/>
				</div>
			 </div>

			 <div className="fields-drag-container">
					<div className="fields">
						<div
							className="title"
							style={{
								'backgroundColor': colorPack.selectorContainerTitleBackground,
								'color': colorPack.selectorContainerTitleText,
							}}
						>
							Fields
						</div>
						<ReactSortable
							className="sortable-container block__list block__list_tags"
							style={{backgroundColor: colorPack.sortableContainerBackground}}
							onChange={fields => this.setState({fields})}
							options={{
								group: 'shared',
								onAdd: this.onAddUpdateField,
							}}
							tag="ul"
						>
							{fieldsRenderer}
						</ReactSortable>
					</div>

					<div className="rows">
						<div
							className="title"
							style={{
								'backgroundColor': colorPack.selectorContainerTitleBackground,
								'color': colorPack.selectorContainerTitleText,
							}}
						>
						 Rows
						</div>
						<ReactSortable
							className="sortable-container block__list block__list_tags"
							style={{backgroundColor: colorPack.sortableContainerBackground}}
							onChange={rowFields => this.setState({rowFields})}
							options={{
								group: 'shared',
								onAdd: this.onAddUpdateField,
								onUpdate: this.onAddUpdateField,
								// onChoose: () => {this.setState({currentFilter: ''})},
							}}
							tag="ul"
						>
							{rowFieldsRender}
						</ReactSortable>
					</div>

					<div className="columns">
						<div
							className="title"
							style={{
								'backgroundColor': colorPack.selectorContainerTitleBackground,
								'color': colorPack.selectorContainerTitleText,
							}}
						>
						 Columns
						</div>
						<ReactSortable
							className="sortable-container block__list block__list_tags"
							style={{backgroundColor: colorPack.sortableContainerBackground}}
							onChange={(colFields) => this.setState({colFields})}
							options={{
								group: 'shared',
								onAdd: this.onAddUpdateField,
								onUpdate: this.onAddUpdateField,
							 // onChoose: () => {this.setState({currentFilter: ''})},
							}}
							tag="ul"
						>
							{colFieldsRender}
						</ReactSortable>
					</div>
				</div>
			</div>
      // <div>
      //   hello
      // </div>
    );

		return(
			<section className="menu">
        <Button onClick={this.handleRightOpen}>Open Right</Button>
        <Drawer
					style={{width: '1000px'}}
          anchor="right"
          open={this.state.isDrawerOpen}
          onRequestClose={this.handleRightClose}
          onClick={this.handleRightClose}
        >
          {menuItems}
        </Drawer>
			</section>
		);
	}
}

Menu.propTypes = {

}

Menu.defaultProps = {
}
