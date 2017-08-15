import React, { PureComponent } from 'react';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import QuickPivot from 'quick-pivot';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

import './styles.scss';

export default class Table extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			leftColumnWidth: props.columnWidth,
			columnWidths: [],
			selectedColumn: null,
			startPos: null,
		};

		this.forceTableUpdate = this.forceTableUpdate.bind(this);
		this.getColumnWidth = this.getColumnWidth.bind(this);
		this.onStop = this.onStop.bind(this);
		this.setSelectedColumn = this.setSelectedColumn.bind(this);

		this.evenOddRowStyle = this.evenOddRowStyle.bind(this);
		this.renderBodyCell = this.renderBodyCell.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.renderLeftHeaderCell = this.renderLeftHeaderCell.bind(this);
    this.renderLeftSideCell = this.renderLeftSideCell.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			columnWidths: Array(nextProps.columnCount > 1 ? nextProps.columnCount - 1 : 1).fill(nextProps.columnWidth),
		});

		this.forceTableUpdate();
	}

	forceTableUpdate() {
    this.bodyGrid.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
    this.grid.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
    this.header.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
    this.leftHeader.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
	}

	getColumnWidth({ index = 0 }) {
		if (this.state.columnWidths.length === 0) {
			return this.props.columnWidth;
		}
		return this.state.columnWidths[index];
	}

	onStop(e, ui) {
		const {
			columnWidths,
			leftColumnWidth,
			selectedColumn,
			startPos,
		} = this.state;

		if (selectedColumn === 'left') {
			this.setState({
				leftColumnWidth: leftColumnWidth + (ui.deltaX),
			});
		} else {
			const newColumnWidths = [...columnWidths];

			newColumnWidths[selectedColumn] = columnWidths[selectedColumn] + (ui.deltaX);

			this.setState({
				columnWidths: newColumnWidths,
			});
		}

		this.forceTableUpdate();
	}

	setSelectedColumn(selectedColumn) {
		this.setState({ selectedColumn });
	}

	evenOddRowStyle({rowIndex = 0, columnIndex = 0}) {
		const {
			colorPack: {
				evenRowBackground,
				oddRowBackground,
			}
		} = this.props;

		if (rowIndex % 2 === 0) {
			return columnIndex % 2 === 0 ?
				{backgroundColor: evenRowBackground} :
				{backgroundColor: oddRowBackground};
		}

		return columnIndex % 2 !== 0 ?
			{backgroundColor: evenRowBackground} :
			{backgroundColor: oddRowBackground};
	}

	renderBodyCell({ columnIndex, key, rowIndex, style }) {
    const {
      data,
      onToggleRow,
      rowFields,
      checkIfInCollapsed,
      headerCounter,
    } = this.props;

		return (
			<div
				className="cell"
				key={key}
				style={{
					...this.evenOddRowStyle({ rowIndex, columnIndex }),
					...style,
				}}
			>
		    <div className="cell-text-container">
  				<div className="body-cell-data">
  					{
  						data.length > 0 ?
  							data.slice(headerCounter)[rowIndex].value[columnIndex + 1] :
  							''
  					}
  				</div>
  			</div>
			</div>
		)
	}

	renderHeaderCell({ columnIndex, key, rowIndex, style }) {
		const {
			colorPack,
			data,
		} = this.props;

		return (
			<div
				className="header-container"
				key={key}
				style={{
					...style,
				}}
			>
				<div className="header-cell">
					{
						data.length > 0 ?
							data[rowIndex].value[columnIndex + 1] :
							''
					}
				</div>
				<Draggable
					axis="x"
					onDrag={this.onStop}
					position={{ x: 0, y: 0 }}
				>
					<div
						className="column-sizer"
						style={{backgroundColor: colorPack.columnResizer}}
						onMouseEnter={this.setSelectedColumn.bind(this, columnIndex)}
					>
					</div>
				</Draggable>
			</div>
		)
	}

	renderLeftHeaderCell({ columnIndex, key, rowIndex, style }) {
		const {
			colorPack,
			data,
		} = this.props;

		return (
			<div
				className="header-container"
				key={key}
				style={{
					...style,
				}}
			>
				<div className="header-cell">
					{
						data.length ?
							data[rowIndex].value[columnIndex] :
							''
					}
				</div>
				<Draggable
					axis="x"
					onDrag={this.onStop}
					position={{ x: 0, y: 0 }}
				>
					<div
						className="column-sizer"
						style={{ backgroundColor: colorPack.columnResizer }}
						onMouseEnter={this.setSelectedColumn.bind(this, 'left')}
					>
					</div>
				</Draggable>
			</div>
		)
	}

	renderLeftSideCell({ columnIndex, key, rowIndex, style }) {
    const {
      data,
      onToggleRow,
      rowFields,
      checkIfInCollapsed,
      headerCounter,
    } = this.props;

		const firstColumnStyle = {};

		if (columnIndex === 0) {
			firstColumnStyle.paddingLeft =
				`${20 * data.slice(headerCounter)[rowIndex].depth}px`;
			if (rowFields.length === 1 ||
					data.slice(headerCounter)[rowIndex].depth < rowFields.length - 1) {
					firstColumnStyle.cursor = 'pointer';
			}
		}

		const arrowStyle = (rowIndex) => {
			if (checkIfInCollapsed(rowIndex)) {
				return '▶';
			}
			if (data.slice(headerCounter)[rowIndex].depth < rowFields.length - 1) {
				return '▼';
			}
			return '';
		}

		return (
			<div
				className="cell"
				key={key}
				style={{
					...firstColumnStyle,
					...this.evenOddRowStyle({ rowIndex, columnIndex }),
					...style,
				}}
				onClick={columnIndex === 0 ? onToggleRow.bind(this, rowIndex) : ''}
			>
		    <div className="cell-text-container">
  				<div className="arrow">
  					{columnIndex === 0 ? arrowStyle(rowIndex) : ''}
  				</div>
  				<div className="cell-data">
  					{
  						data.length ?
  							data.slice(headerCounter)[rowIndex].value[columnIndex] :
  							''
  					}
  				</div>
  			</div>
			</div>
		)
	}

	render() {
    const {
      headerCounter,
      headerHeight,
      rowHeight,
      overscanColumnCount,
      overscanRowCount,
      rowCount,
      columnCount,
			colorPack,
		} = this.props;

		const {
			leftColumnWidth,
		} = this.state;

		const height = (window.innerHeight - 240 - (headerCounter * 40));

		return(
			<section className="virtualized-table">
				<div className="pivot-grid">
					<section className='pivot-grid'>
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
		                    color: colorPack.leftHeaderCellText,
												height: headerHeight * headerCounter,
												width: leftColumnWidth,
		                  }}
		                >
		                  <Grid
		                    ref={(input) => { this.header = input; }}
		                    cellRenderer={this.renderLeftHeaderCell}
		                    className="HeaderGrid"
												style={{backgroundColor: colorPack.headerGridBackground}}
		                    width={leftColumnWidth}
		                    height={headerHeight * headerCounter}
		                    rowHeight={headerHeight}
		                    columnWidth={leftColumnWidth}
		                    rowCount={headerCounter}
		                    columnCount={1}
		                  />
		                </div>
		                <div
		                  className="LeftSideGridContainer"
		                  style={{
		                    position: 'absolute',
		                    left: 0,
		                    top: headerHeight * headerCounter,
		                    color: colorPack.leftSideGridText,
		                  }}
		                >
		                  <Grid
		                    ref={(input) => { this.leftHeader = input; }}
		                    overscanColumnCount={overscanColumnCount}
		                    overscanRowCount={overscanRowCount}
		                    cellRenderer={this.renderLeftSideCell}
		                    columnWidth={leftColumnWidth}
		                    columnCount={1}
		                    className="LeftSideGrid"
                        style={{backgroundColor: colorPack.leftHeaderCellBackground}}
		                    height={height - scrollbarSize()}
		                    rowHeight={rowHeight}
		                    rowCount={rowCount === 0 ? 0 : (rowCount - headerCounter)}
		                    scrollTop={scrollTop}
		                    width={leftColumnWidth}
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
		                            height: headerHeight * headerCounter,
		                            width: width - scrollbarSize(),
		                          }}
		                        >
		                          <Grid
		                            ref={(input) => { this.grid = input; }}
		                            className="HeaderGrid"
		                            columnWidth={this.getColumnWidth}
		                            columnCount={columnCount > 0 ? columnCount - 1 : 0}
		                            height={headerHeight * headerCounter}
		                            overscanColumnCount={overscanColumnCount}
		                            cellRenderer={this.renderHeaderCell}
		                            rowHeight={headerHeight}
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
		                            columnWidth={this.getColumnWidth}
		                            columnCount={columnCount > 0 ? columnCount - 1 : 0}
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
		    </section>
				</div>
			</section>
		);
	}
}

Table.propTypes = {
	colorPack: PropTypes.object,
	headerHeight: PropTypes.number.isRequired,
	rowHeight: PropTypes.number.isRequired,
	headerCounter: PropTypes.number.isRequired,
	columnWidth: PropTypes.number.isRequired,
	overscanColumnCount: PropTypes.number.isRequired,
	overscanRowCount: PropTypes.number.isRequired,
	data: PropTypes.array.isRequired,
	onToggleRow: PropTypes.func.isRequired,
	checkIfInCollapsed: PropTypes.func.isRequired,
	rowFields: PropTypes.array.isRequired,
	rowCount: PropTypes.number.isRequired,
	columnCount: PropTypes.number.isRequired,
}

Table.defaultProps = {
	colorPack: {
		columnResizer: 'none',
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
	},
}
