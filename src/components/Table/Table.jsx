import React, { PureComponent } from 'react';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import { ContentBox }
	from '../ContentBox/ContentBox.jsx';
import cn from 'classnames';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import QuickPivot from 'quick-pivot';

import './styles.scss';

export default class Table extends PureComponent {
	constructor(props) {
		super(props);

		this.renderBodyCell = this.renderBodyCell.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.renderLeftHeaderCell = this.renderLeftHeaderCell.bind(this);
    this.renderLeftSideCell = this.renderLeftSideCell.bind(this);
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
		} = this.props;

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
      colorPack,
      onToggleRow,
      rowFields,
      checkIfInCollapsed,
      headerCounter,
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
			}``
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
				className={classNames}
				key={key}
				style={Object.assign({}, firstColumnStyle, evenOddRowStyle, style)}
				onClick={columnIndex === 0 ? onToggleRow.bind(this, rowIndex) : ''}
			>
		    <div className="cell-text-container">
  				<div className="arrow">
  					{columnIndex === 0 ? arrowStyle(rowIndex) : ''}
  				</div>
  				<div className="cell-data">
  					{`${data.length ?
  						data.slice(headerCounter)[rowIndex].value[columnIndex] : ''}`}
  				</div>
  			</div>
			</div>
		)
	}

	render() {
    const {
      headerCounter,
      rowHeight,
      columnWidth,
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
