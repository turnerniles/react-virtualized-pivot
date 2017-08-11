import React, { PureComponent } from 'react';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import QuickPivot from 'quick-pivot';
import Draggable from 'react-draggable';

import './styles.scss';

export default class Table extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			columnWidths: Array(props.columnCount).fill(props.columnWidth),
		};

		this.getColumnWidth = this.getColumnWidth.bind(this);
		this.onStart = this.onStart.bind(this);
		this.onStop = this.onStop.bind(this);

		this.evenOddRowStyle = this.evenOddRowStyle.bind(this);
		this.renderBodyCell = this.renderBodyCell.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.renderLeftHeaderCell = this.renderLeftHeaderCell.bind(this);
    this.renderLeftSideCell = this.renderLeftSideCell.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		console.log('receiving new props', nextProps);
	}

	getColumnWidth(index) {
		console.log('updating column width?', index);
		if (this.state.columnWidths.length === 0) return 0;
		return this.state.columnWidths[index];
	}

	onStart(e, x, y) {
		console.log('dragging started!', e);
		console.log('x started!', x);
		console.log('y started!', y);
	}

	onStop(e, x, y) {
		console.log('dragging stoped!', e);
		console.log('x stoped!', x);
		console.log('y stoped!', y);
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
		/** first column is for pivoted row headers */
		if (columnIndex < 1) {
			return '';
		}

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
  						data.length ?
  							data.slice(headerCounter)[rowIndex].value[columnIndex] :
  							''
  					}
  				</div>
  			</div>
			</div>
		)
	}

	renderHeaderCell({ columnIndex, key, rowIndex, style }) {
		if (columnIndex < 1) {
			return
		}
		return this.renderLeftHeaderCell({ columnIndex, key, rowIndex, style })
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
					overflow: 'hidden',
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
					onStart={this.onStart}
					onStop={this.onStop}
				>
					<div
						className="column-sizer"
						style={{backgroundColor: colorPack.columnResizer}}
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
		} = this.props;

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
		                    position: 'absolute',
		                    left: 0,
		                    top: 0,
		                    color: colorPack.leftHeaderCellText,
												height: headerHeight * headerCounter,
												width: this.getColumnWidth(0),
		                  }}
		                >
		                  <Grid
		                    ref={(input) => { this.header = input; }}
		                    cellRenderer={this.renderLeftHeaderCell}
		                    className={'HeaderGrid'}
												style={{backgroundColor: colorPack.headerGridBackground}}
		                    width={this.getColumnWidth(0)}
		                    height={headerHeight * headerCounter}
		                    rowHeight={headerHeight}
		                    columnWidth={this.getColumnWidth(0)}
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
		                    columnWidth={this.getColumnWidth(0)}
		                    columnCount={1}
		                    className={'LeftSideGrid'}
                        style={{backgroundColor: colorPack.leftHeaderCellBackground}}
		                    height={height - scrollbarSize()}
		                    rowHeight={rowHeight}
		                    rowCount={rowCount === 0 ? 0 : (rowCount - headerCounter)}
		                    scrollTop={scrollTop}
		                    width={this.getColumnWidth(0)}
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
		                            columnCount={columnCount}
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
		    </section>
				</div>
			</section>
		);
	}
}
