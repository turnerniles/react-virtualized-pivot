import React, { PureComponent } from 'react';
import { List } from 'react-virtualized';
import cn from 'classnames';
import QuickPivot from 'quick-pivot';
import Select from 'react-select-plus';
import ReactSortable from '../CustomReactSortable/CustomReactSortable.jsx';
import Table from '../Table/Table.jsx';

window.pivot = QuickPivot;

import 'react-select-plus/dist/react-select-plus.css';
import './styles.scss';

export default class Pivot extends PureComponent {
	constructor(props) {
		super(props);

		const aggregationDimensions = this.props.data !== undefined ?
			this.props.data[0].map((item, index) => {
				return {value: item, label: item}
		}) : [];
		const dataArray = this.props.data !== undefined ? this.props.data : [];
		const fields = this.props.data !== undefined ? this.props.data[0] : [];
		const pivot = this.props.data !== undefined ?
			new QuickPivot(this.props.data, [], [],
			this.props.selectedAggregationDimension || '', 'sum') :
			{};

		this.state = {
				aggregationDimensions,
				dataArray,
				fields,
				pivot,
				colFields: [],
				rowFields: [],
				selectedAggregationType: 'sum',
				selectedAggregationDimension: this.props.selectedAggregationDimension || '',
				currentFilter: '',
				currentValues: {},
				filters: {},
				columnWidth: 75,
      	columnCount: 0,
      	overscanColumnCount: 0,
      	overscanRowCount: 5,
      	rowHeight: 40,
      	rowCount: 0,
				data:[],
				header:{},
				headerCounter: 0,
    };

		this.onSelectAggregationDimension =
		this.onSelectAggregationDimension.bind(this);
		this.onSelectAggregationType = this.onSelectAggregationType.bind(this);
		this.onAddUpdateField = this.onAddUpdateField.bind(this);
		this.onToggleRow = this.onToggleRow.bind(this);
		this.checkIfInCollapsed = this.checkIfInCollapsed.bind(this);
		this.displayFilter = this.displayFilter.bind(this);
		this.addToFilters = this.addToFilters.bind(this);
		this.submitFilters = this.submitFilters.bind(this);
		this.showFilterMenu = this.showFilterMenu.bind(this);
		this.listRowRenderer = this.listRowRenderer.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const aggregationDimensions = nextProps.data !== undefined ?
			nextProps.data[0].map((item, index) => {
				return {value: item, label: item}
		}) : [];
		const dataArray = nextProps.data !== undefined ? nextProps.data : [];
		const fields = nextProps.data !== undefined ? nextProps.data[0] : [];
		const pivot = nextProps.data !== undefined ?
			new QuickPivot(nextProps.data, [], [],
				nextProps.selectedAggregationDimension || '', 'sum') : {};

		// Reset entire state execpt selectedAggregationType
    this.setState({
			aggregationDimensions,
			dataArray,
			fields,
			pivot,
			colFields: [],
			rowFields: [],
			selectedAggregationDimension: nextProps.selectedAggregationDimension || '',
			currentFilter: '',
			currentValues: {},
			filters: {},
			columnWidth: 75,
			columnCount: 0,
			overscanColumnCount: 0,
			overscanRowCount: 5,
			rowHeight: 40,
			rowCount: 0,
			data:[],
			header:{},
			headerCounter: 0,
		})
  }

	onSelectAggregationType(selectedAggregationType) {
		const {
			colFields,
			dataArray,
			rowFields,
			selectedAggregationDimension,
			filters,
		} = this.state;

		const pivotedData = new QuickPivot(
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension,
			selectedAggregationType.value
		);

		Object.keys(filters).forEach((filter) => {
			pivotedData.filter((elem, index, array) => {
				return filters[filter].findIndex((field) => {
					return field == elem[filter]
				}
			) === -1
			});
		})

		let headerCounter = 0;

		if(pivotedData.data){
			while(true) {
				if (pivotedData.data.table[headerCounter].type === 'colHeader') {
					headerCounter += 1;
				} else {
					break;
				}
			}
		}

		this.setState({
			headerCounter,
			pivot: pivotedData,
			selectedAggregationType: selectedAggregationType.value,
			columnCount: (pivotedData.data.table.length &&
				pivotedData.data.table[0].value.length) ?
				pivotedData.data.table[0].value.length : 0,
			rowCount: pivotedData.data.table.length || 0,
			data: pivotedData.data.table,
			header: pivotedData.data.table[0]
		})
	}

	onSelectAggregationDimension (selectedAggregationDimension) {
		const {
			colFields,
			dataArray,
			rowFields,
			selectedAggregationType,
			filters,
		} = this.state;

		const pivotedData = new QuickPivot(
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension.value,
			selectedAggregationType
		);

		Object.keys(filters).forEach((filter) => {
			pivotedData.filter((elem, index, array) => {
				return filters[filter].findIndex((field) => {
					return field == elem[filter]
				}
			) === -1
			});
		})

		let headerCounter = 0;

		if (pivotedData.data) {
			while(true) {
				if (pivotedData.data.table[headerCounter].type === 'colHeader') {
					headerCounter += 1;
				} else {
					break
				}
			}
		}

		this.setState({
			headerCounter,
			pivot: pivotedData,
			selectedAggregationDimension: selectedAggregationDimension.value,
			columnCount: (pivotedData.data.table.length &&
				pivotedData.data.table[0].value.length) ?
				pivotedData.data.table[0].value.length : 0,
			rowCount: pivotedData.data.table.length || 0,
			data: pivotedData.data.table,
			header: pivotedData.data.table[0]
		})
	}

	onAddUpdateField() {
		const {
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension,
			selectedAggregationType,
			filters
		} = this.state;

		const pivotedData = new QuickPivot(
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension,
			selectedAggregationType
		);

		Object.keys(filters).forEach((filter) => {
			pivotedData.filter((elem, index, array) => {
				return filters[filter].findIndex((field) => {
					return field == elem[filter]
				}
			) === -1
			});
		})

		let headerCounter = 0;

		if (pivotedData.data) {
			while(true) {
				if (pivotedData.data.table[headerCounter].type === 'colHeader') {
					headerCounter += 1;
				} else {
					break
				}
			}
		}

		this.setState({
			headerCounter,
			pivot: pivotedData,
			columnCount: (pivotedData.data.table.length &&
					pivotedData.data.table[0].value.length) ?
				pivotedData.data.table[0].value.length : 0,
			rowCount: pivotedData.data.table.length || 0,
			data: pivotedData.data.table,
			header: pivotedData.data.table[0],
		});
	}

	onToggleRow(rowIndex) {
		const {
			pivot
		} = this.state;

		//row index + headerCount because we remove/slice the header off the data we
		//render in the renderBodyCell
		const newPivot = pivot.toggle(rowIndex + this.state.headerCounter);

		this.setState(
		{
			pivot: newPivot,
			columnCount: (newPivot.data.table.length &&
				newPivot.data.table[0].value.length) ?
			newPivot.data.table[0].value.length : 0,
			rowCount: newPivot.data.table.length || 0,
			data: newPivot.data.table,
			header: newPivot.data.table[0],
		});
	}

	checkIfInCollapsed(rowIndex) {
		const {
			pivot,
			headerCounter
		} = this.state;

		return pivot.data.table[rowIndex + headerCounter].row in pivot.collapsedRows
	}
		if (this.header) {
			console.log('header', this.header)
			this.header.recomputeGridSize({columnIndex: 0, rowIndex: 0});
		}
		if (this.leftHeader) {
			this.leftHeader.recomputeGridSize({columnIndex: 0, rowIndex: 0});
		}
		if (this.grid) {
			this.grid.recomputeGridSize({columnIndex: 0, rowIndex: 0});
		}
		if (this.bodyGrid) {
			this.bodyGrid.recomputeGridSize({columnIndex: 0, rowIndex: 0});
		}
	}

	listRowRenderer({ index, isScrolling, key, style }){
		const { currentValues, currentFilter, filters, } = this.state;
		return (
			<div key={currentValues[index]} className='filter-container' style={style}>
				<input
					onChange={this.addToFilters.bind(this, currentValues[index])}
					className="filter-checkbox"
					type="checkbox"
					defaultChecked={(filters[currentFilter] === undefined) ? false :
						filters[currentFilter].indexOf(currentValues[index]) !== -1}
				>
				</input>
				<div className='filter-name'>
					{currentValues[index]}
				</div>
			</div>
		)
	}

	displayFilter(fieldName) {
		const {
			filterMenuToDisplay,
			currentValues,
			pivot
		} = this.state;

		const uniqueValues = pivot.getUniqueValues(fieldName);
	}

	addToFilters(filterValue) {
		const {
			currentFilter,
		} = this.state;

		const {
			filters
		} = this.state;

		if (!(currentFilter in filters)) filters[currentFilter] = [];
		filters[currentFilter].indexOf(filterValue) === -1 ?
			filters[currentFilter].push(filterValue) :
			filters[currentFilter].splice(filters[currentFilter].indexOf(filterValue), 1)

		this.setState({
			filters,
		})
	}

	submitFilters() {
		const {
			currentFilter,
			filters,
			pivot,
		} = this.state;

		// create new pivot and apply all filters. Because quick-pivot does not
		// account for removal of filters
		const newPivot = this.props.data !== undefined ?
			new QuickPivot(this.props.data, this.state.rowFields, this.state.colFields,
			this.props.selectedAggregationDimension || '', 'sum') :
			{};

		Object.keys(filters).forEach((filter) => {
				newPivot.filter((elem, index, array) => {
					return filters[filter].findIndex((field) => {
						return field == elem[filter]
					}
				) === -1
				});
		})

		let headerCounter = 0;

		if (newPivot.data) {
			while(true) {
				if (newPivot.data.table[headerCounter].type === 'colHeader') {
					headerCounter += 1;
				} else {
					break
				}
			}
		}

		this.setState(
		{
			headerCounter,
			pivot: newPivot,
			columnCount: (newPivot.data.table.length &&
				newPivot.data.table[0].value.length) ?
			newPivot.data.table[0].value.length : 0,
			rowCount: newPivot.data.table.length || 0,
			data: newPivot.data.table,
			header: newPivot.data.table[0],
			currentFilter: '',
		});
	}

	showFilterMenu(field){
		const {
			pivot
		} = this.state;

		const uniqueValues = pivot.getUniqueValues(field);

		this.setState({
			currentFilter: field,
			currentValues: uniqueValues,
		});
	}

	render() {
		const {
			aggregationDimensions,
			selectedAggregationType,
			selectedAggregationDimension,
			columnCount,
      columnWidth,
			headerCounter,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
			currentValues,
			displayFilterMenu,
			currentFilter,
			filters,
			rowFields,
			data,
		} = this.state;

    const colorPack = this.props.colorPack !== undefined ? this.props.colorPack :
		{
			sortableFieldBackground: '#5F9EDF',
			sortableFieldText: '#fff',
			sortableContainerBackground: '#fff',
			selectorContainerTitleBackground: '#FF7373',
			selectorContainerTitleText: '#fff',
			leftHeaderCellBackground:'rgb(188, 57, 89)',
			leftHeaderCellText:'#fff',
			headerGridBackground:'rgb(51, 51, 51)',
			headerGridText:'#fff',
			leftSideGridBackground: 'rgb(188, 57, 89)',
			leftSideGridText:'#fff',
			bodyGridBackground: 'rgb(120, 54, 70)',
			bodyGridText:'#fff',
			evenRowBackground: '',
			oddRowBackground: 'rgba(0, 0, 0, .1)',
		};

		const height = (window.innerHeight - 240 - (this.state.headerCounter * 40))

		const aggregationTypes = [
	    { value: 'sum', label: 'sum' },
	    { value: 'count', label: 'count' },
			{ value: 'min', label: 'min' },
			{ value: 'max', label: 'max' },
			{ value: 'average', label: 'average' },
		];

		//We are not using deconstructed state consts here due to
		// react-sortablejs bug
		const fields = this.state.fields.length ? this.state.fields.map((field, index) =>
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
	  							rowRenderer={this.listRowRenderer}
	  							width={100}
	  						/>
						 	</div>
						<div onClick={this.submitFilters} className="filter-submit">Submit</div>
					</div>
					}
				<div className="inner-filter-container">
					<div className="filter-text">
					{field}
					</div>
					<div
	  				className="filter-button"
	  				onClick={this.showFilterMenu.bind(this, field)}
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
	  				onClick={this.showFilterMenu.bind(this, field)}
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
  							rowRenderer={this.listRowRenderer}
  							width={100}
  						/>
						</div>
					<div onClick={this.submitFilters} className="filter-submit">Submit</div>
				</div>
				}
			</li>
		));

		const colFieldsRender = this.state.colFields.map((field, index) =>
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
	  				onClick={this.showFilterMenu.bind(this, field)}
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
  							rowRenderer={this.listRowRenderer}
  							width={100}
  						/>
						</div>
					<div onClick={this.submitFilters} className="filter-submit">Submit</div>
				</div>
				}
			</li>
		));
		return(
			<section className="virtualized-pivot">
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
							    onChange={this.onSelectAggregationType}
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
									onChange={this.onSelectAggregationDimension}
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
			        	{fields}
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
				<div className="pivot-grid">
					<section className="pivot-grid">
						<Table
							colorPack={colorPack}
							rowHeight={rowHeight}
							headerCounter={headerCounter}
							columnWidth={columnWidth}
							overscanColumnCount={overscanColumnCount}
							overscanRowCount={overscanRowCount}
							data={data !== undefined ? data : [[]]}
							onToggleRow={this.onToggleRow}
							checkIfInCollapsed={this.checkIfInCollapsed}
							rowFields={rowFields}
							rowCount={rowCount}
							columnCount={columnCount}
						>
						</Table>
		    </section>
				</div>
			</section>
		);
	}
}
