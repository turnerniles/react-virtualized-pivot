import React, { PureComponent } from 'react'
import { Grid, List, AutoSizer, ScrollSync } from 'react-virtualized'
import { ContentBox }
	from '../ContentBox/ContentBox.jsx'
import cn from 'classnames'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import QuickPivot from 'quick-pivot';
import Select from 'react-select-plus';
import ReactSortable from '../CustomReactSortable/CustomReactSortable.jsx';

import 'react-select-plus/dist/react-select-plus.css';
import './styles.scss';

export default class Pivot extends PureComponent {
	constructor(props){
		super(props);

		this.state = {
				aggregationDimensions: this.props.data[0].map((item, index) => {
					return {value: item, label: item}
				}),
				colFields: [],
				pivot: new QuickPivot(this.props.data, [], [],
					this.props.selectedAggregationDimension || '', 'sum'),
				dataArray: this.props.data,
				fields: this.props.data[0],
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
				data:{},
				header:{},
				headerCounter: 0,
    };

		this.onSelectAggregationDimension =
		this.onSelectAggregationDimension.bind(this);
		this.onSelectAggregationType = this.onSelectAggregationType.bind(this);
		this.onAddUpdateField = this.onAddUpdateField.bind(this);
		this.onToggleRow = this.onToggleRow.bind(this);
		this.checkIfInCollapsed = this.checkIfInCollapsed.bind(this);
		this.forceRenderGrid = this.forceRenderGrid.bind(this);
		this.renderBodyCell = this.renderBodyCell.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.renderLeftHeaderCell = this.renderLeftHeaderCell.bind(this);
    this.renderLeftSideCell = this.renderLeftSideCell.bind(this);
		this.displayFilter = this.displayFilter.bind(this);
		this.addToFilters = this.addToFilters.bind(this);
		this.submitFilters = this.submitFilters.bind(this);
		this.showFilterMenu = this.showFilterMenu.bind(this);
		this.listRowRenderer = this.listRowRenderer.bind(this);
	}

	componentWillReceiveProps(nextProps) {
    this.setState({
			aggregationDimensions: nextProps.data[0].map((item, index) => {
				return {value: item, label: item}
			}),
			dataArray: nextProps.data,
			data: {},
			headers: {},
			fields: nextProps.data[0],
			selectedAggregationDimension: nextProps.selectedAggregationDimension || '',
			colFields: [],
			rowFields: [],
			pivot: new QuickPivot(nextProps.data, [], [],
				nextProps.selectedAggregationDimension || '', 'sum'),
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

		this.forceRenderGrid();
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

		this.forceRenderGrid();
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

		this.forceRenderGrid();
	}

	onToggleRow(rowIndex) {
		const {
			pivot
		} = this.state;
		//row index headerCount because we remove/slice the header off the data we
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
		this.forceRenderGrid();
	}

	checkIfInCollapsed(rowIndex) {
		const {
			pivot,
			headerCounter
		} = this.state;

		return pivot.data.table[rowIndex + headerCounter].row in pivot.collapsedRows
	}

	forceRenderGrid() {
		if (this.header) {
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

	renderBodyCell({ columnIndex, key, rowIndex, style }) {
		if (columnIndex < 1) {
			return
		}

		return this.renderLeftSideCell({ columnIndex, key, rowIndex, style })
	}

	renderHeaderCell({ columnIndex, key, rowIndex, style }) {
		if (columnIndex < 1) {
			return
		}
		return this.renderLeftHeaderCell({ columnIndex, key, rowIndex, style })
	}

	renderLeftHeaderCell({ columnIndex, key, rowIndex, style }) {
		const {
			data,
		} = this.state;

		return (
			<div
				className={'headerCell'}
				key={key}
				style={style}
			>
				{`${data.length ?
					data[rowIndex].value[columnIndex] : ''}`}
			</div>
		)
	}

	renderLeftSideCell({ columnIndex, key, rowIndex, style }) {
		const {
			data,
			headerCounter,
			rowFields,
		} = this.state;

    const {
      colorPack
    } = this.props;

    const evenOddRowStyle = rowIndex % 2 === 0
      ? columnIndex % 2 === 0 ? {backgroundColor: colorPack.evenRowBackground} : {backgroundColor: colorPack.oddRowBackground}
      : columnIndex % 2 !== 0 ? {backgroundColor: colorPack.evenRowBackground} : {backgroundColor: colorPack.oddRowBackground};
		const classNames = cn('cell');
		const firstColumnStyle = {};
			if (columnIndex === 0) {
				firstColumnStyle['paddingLeft'] =
					`${20 * data.slice(headerCounter)[rowIndex].depth}px`;
				if (rowFields.length === 1 ||
						data.slice(headerCounter)[rowIndex].depth <
							rowFields.length - 1) {
						firstColumnStyle['cursor'] = 'pointer';
				}
			}
		const arrowStyle = (rowIndex) => {
			if(this.checkIfInCollapsed(rowIndex)){
				return '▶';
			}
			if (data.slice(headerCounter)[rowIndex].depth < rowFields.length - 1) {
				return '▼';
			}
			return '';
		}

		return (
			<div
				className={classNames}
				key={key}
				style={Object.assign({}, firstColumnStyle, evenOddRowStyle, style)}
				onClick={columnIndex === 0 ? this.onToggleRow.bind(this, rowIndex) : ''}
			>
				<div className="cell-text-container">
				<div className="arrow">
					{ columnIndex === 0 ? arrowStyle(rowIndex) : ''}
				</div>
				<div className="cell-data">
					{`${data.length ?
						data.slice(headerCounter)[rowIndex].value[columnIndex] : ''}`}
				</div>
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

		if (currentFilter in filters) {
			pivot.filter((elem, index, array) => {
				return filters[currentFilter].findIndex((field) => {
					return field == elem[currentFilter]
				}
			) === -1
			});

			let headerCounter = 0;

			if (pivot.data) {
				while(true) {
					if (pivot.data.table[headerCounter].type === 'colHeader') {
						headerCounter += 1;
					} else {
						break
					}
				}
			}

			this.setState(
			{
				headerCounter,
				pivot,
				columnCount: (pivot.data.table.length &&
					pivot.data.table[0].value.length) ?
				pivot.data.table[0].value.length : 0,
				rowCount: pivot.data.table.length || 0,
				data: pivot.data.table,
				header: pivot.data.table[0],
				currentFilter: '',
			});
		} else {
			this.setState({
				currentFilter: '',
			})
		}
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
			filters
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
		const rowFieldsRender = this.state.rowFields.map((field, index) =>
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
								handle='.my-handle'
								onChange={fields => this.setState({fields})}
		            options={{
		              group: 'shared',
		              onAdd: this.onAddUpdateField,
					       // onChoose: () => {this.setState({currentFilter: ''})},
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

					<section className='pivot-grid'>
		        <ContentBox>
		        <ScrollSync>
		          {({
								clientHeight,
								clientWidth,
								onScroll,
								scrollHeight,
								scrollLeft,
								scrollTop,
								scrollWidth
							}) => {
		            return (
		              <div className="GridRow">
		                <div
		                  className="LeftSideGridContainer"
		                  style={{
		                    position: 'absolute',
		                    left: 0,
		                    top: 0,
		                    color: colorPack.leftHeaderCellText,
												height: rowHeight * headerCounter,
												width: columnWidth,
		                  }}
		                >
		                  <Grid
		                    ref={(input) => { this.header = input; }}
		                    cellRenderer={this.renderLeftHeaderCell}
		                    className={'HeaderGrid'}
												style={{backgroundColor: colorPack.headerGridBackground}}
		                    width={columnWidth}
		                    height={rowHeight * headerCounter}
		                    rowHeight={rowHeight}
		                    columnWidth={columnWidth}
		                    rowCount={headerCounter}
		                    columnCount={1}
		                  />
		                </div>
		                <div
		                  className="LeftSideGridContainer"
		                  style={{
		                    position: 'absolute',
		                    left: 0,
		                    top: rowHeight * headerCounter,
		                    color: colorPack.leftSideGridText,
		                  }}
		                >
		                  <Grid
		                    ref={(input) => { this.leftHeader = input; }}
		                    overscanColumnCount={overscanColumnCount}
		                    overscanRowCount={overscanRowCount}
		                    cellRenderer={this.renderLeftSideCell}
		                    columnWidth={columnWidth}
		                    columnCount={1}
		                    className={'LeftSideGrid'}
                        style={{backgroundColor: colorPack.leftHeaderCellBackground}}
		                    height={height - scrollbarSize()}
		                    rowHeight={rowHeight}
		                    rowCount={rowCount === 0 ? 0 : (rowCount - headerCounter)}
		                    scrollTop={scrollTop}
		                    width={columnWidth}
		                  />
		                </div>
		                <div className="GridColumn">
		                  <AutoSizer
		                    disableHeight
		                  >
		                    {({ width }) => (
		                      <div>
		                        <div
		                          style={{
		                            color: colorPack.headerGridText,
                                backgroundColor: colorPack.headerGridBackground,
		                            height: rowHeight * headerCounter,
		                            width: width - scrollbarSize(),
		                          }}
		                        >
		                          <Grid
		                            ref={(input) => { this.grid = input; }}
		                            className="HeaderGrid"
		                            columnWidth={columnWidth}
		                            columnCount={columnCount}
		                            height={rowHeight * headerCounter}
		                            overscanColumnCount={overscanColumnCount}
		                            cellRenderer={this.renderHeaderCell}
		                            rowHeight={rowHeight}
		                            rowCount={headerCounter}
		                            scrollLeft={scrollLeft}
		                            width={width - scrollbarSize()}
		                          />
		                        </div>
		                        <div
		                          style={{
		                            color: colorPack.bodyGridText,
		                            height,
		                            width,
		                          }}
		                        >
		                          <Grid
		                            ref={(input) => { this.bodyGrid = input; }}
		                            className="BodyGrid"
                                style={{backgroundColor: colorPack.bodyGridBackground}}
		                            columnWidth={columnWidth}
		                            columnCount={columnCount}
		                            height={height}
		                            onScroll={onScroll}
		                            overscanColumnCount={overscanColumnCount}
		                            overscanRowCount={overscanRowCount}
		                            cellRenderer={this.renderBodyCell}
		                            rowHeight={rowHeight}
		                            rowCount={rowCount === 0 ? 0 : (rowCount - headerCounter)}
		                            width={width}
		                          />
		                        </div>
		                      </div>
		                    )}
		                  </AutoSizer>
		                </div>
		              </div>
		            )
		          }}
		        </ScrollSync>
		      </ContentBox>
		    </section>
				</div>
			</section>
		);
	}
}
