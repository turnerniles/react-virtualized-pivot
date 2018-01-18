import React, { PureComponent } from 'react';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import SettingsIcon from '../../icons/SettingsIcon.jsx';
import arrowStyle from './arrowStyle';
import evenOddRowStyle from './evenOddRowStyle';
import onClick from './onClick';
import rowHeaderOnClick from './rowHeaderOnClick';
import './styles.scss';

const minColWidth = 20;

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
    this.onDrag = this.onDrag.bind(this);
    this.setSelectedColumn = this.setSelectedColumn.bind(this);

    this.renderBodyCell = this.renderBodyCell.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.renderLeftHeaderCell = this.renderLeftHeaderCell.bind(this);
    this.renderLeftSideCell = this.renderLeftSideCell.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.rawData === this.props.rawData)
    console.log(nextProps.rawData)
    console.log(this.props.rawData)
    console.log('hi', nextProps)
    if (nextProps.columnCount !== this.props.columnCount) {
      this.setState({
        columnWidths: Array(nextProps.columnCount > 1 ?
          nextProps.columnCount - 1 :
          1).fill(nextProps.columnWidth),
      });
      this.forceTableUpdate();
    }
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

  onDrag(e, ui) {
    const {
      columnWidths,
      leftColumnWidth,
      selectedColumn,
    } = this.state;

    if (selectedColumn === 'left') {
      this.setState({
        leftColumnWidth: Math.max(leftColumnWidth + (ui.deltaX), minColWidth),
      });
    } else {
      const newColumnWidths = [...columnWidths];

      newColumnWidths[selectedColumn] = Math.max(
        columnWidths[selectedColumn] + (ui.deltaX), minColWidth);

      this.setState({
        columnWidths: newColumnWidths,
      });
    }

    this.forceTableUpdate();
  }

  setSelectedColumn(selectedColumn) {
    this.setState({ selectedColumn });
  }

  renderBodyCell({ columnIndex, key, rowIndex, style }) {
    const {
      bodyCellValueTransformation,
      collapsedRows,
      colorPack: {
        evenRowBackground,
        oddRowBackground,
      },
      data,
      headerCounter,
      onGridCellClick,
      originalArgs,
      rawData,
    } = this.props;

    return (
      <div
        className="cell"
        key={key}
        style={{
          ...evenOddRowStyle({
            rowIndex,
            columnIndex,
            evenRowBackground,
            oddRowBackground,
          }),
          ...style,
          borderRight: `1px solid ${this.props.colorPack.gridBorders}`,
          borderBottom: `1px solid ${this.props.colorPack.gridBorders}`,
          overflow: 'hidden',
          lineHeight: 2.5,
          textAlign: 'right',
          display: 'inline-block',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          direction: 'ltr',
        }}
        onClick={onClick.bind(this, {
          collapsedRows,
          columnIndex,
          data,
          headerCounter,
          onGridCellClick,
          originalArgs,
          rawData,
          rowIndex,
        })}
      >
        {
          data.length > 0 ?
            bodyCellValueTransformation({
              rowIndex,
              columnIndex,
              value: data[headerCounter + rowIndex].value[columnIndex + 1],
            }) :
            bodyCellValueTransformation({
              rowIndex,
              columnIndex,
              value: '',
            })
        }
      </div>
    );
  }

  renderHeaderCell({ columnIndex, key, rowIndex, style }) {
    const {
      colorPack,
      data,
      onGridHeaderCellClick,
    } = this.props;

    return (
      <div
        className="header-container"
        key={key}
        onClick={onGridHeaderCellClick.bind(this, { rowIndex, columnIndex })}
        onMouseDown={this.setSelectedColumn.bind(this, columnIndex)}
        style={{
          ...style,
          backgroundColor: colorPack.headerGridBackground,
        }}
      >
        <div
          className="header-cell"
          style={{
            borderTop: rowIndex === 0 ?
              `1px solid ${colorPack.gridBorders}` : '',
            borderBottom: `1px solid
              ${this.props.colorPack.gridBorders}`,
            lineHeight: 2.8,
          }}
        >
          {
            data.length > 0 ?
              data[rowIndex].value[columnIndex + 1] :
              ''
          }
        </div>
        <Draggable
          axis="x"
          onDrag={this.onDrag}
          position={{ x: 0, y: 0 }}
        >
          <div
            className="column-sizer"
            style={{
              backgroundColor: colorPack.leftHeaderCellBackground,
              borderTop: rowIndex === 0 ?
                `1px solid ${colorPack.gridBorders}` : '',
              borderRight: `1px solid ${this.props.colorPack.columnResizer}`,
              borderBottom: `1px solid ${this.props.colorPack.columnResizer}`,
            }}
          >
          </div>
        </Draggable>
      </div>
    );
  }

  renderLeftHeaderCell({ columnIndex, key, rowIndex, style }) {
    const {
      colorPack,
      data,
      onLeftHeaderCellClick,
      handleRightOpen,
    } = this.props;

    return (
      <div
        className="header-container"
        key={key}
        onClick={onLeftHeaderCellClick}
        onMouseDown={this.setSelectedColumn.bind(this, 'left')}
        style={{
          ...style,
          borderLeft: `1px solid ${this.props.colorPack.columnResizer}`,
        }}
      >
        <div className="header-cell">
          { rowIndex === 0 &&
            <div
              onClick={handleRightOpen}
              style={{
                height: '40px',
                padding: '8px',
                width: '40px',
                cursor: 'pointer',
              }}
            >
              <SettingsIcon
                color={colorPack.icons}
              />
            </div>
          }
          {
            data.length ?
              data[rowIndex].value[columnIndex] : ''
          }
        </div>
        <Draggable
          axis="x"
          onDrag={this.onDrag}
          position={{ x: 0, y: 0 }}
        >
          <div
            className="column-sizer"
            style={{
              backgroundColor: colorPack.leftHeaderCellBackground,
              borderRight: `1px solid ${this.props.colorPack.columnResizer}`,
              borderBottom: columnIndex === 0 ? 'inherit' :
                `1px solid ${this.props.colorPack.columnResizer}`,
            }}
          >
          </div>
        </Draggable>
      </div>
    );
  }

  renderLeftSideCell({ columnIndex, key, rowIndex, style }) {
    const {
      checkIfInCollapsed,
      colFields,
      collapsedRows,
      colorPack: {
        evenRowBackground,
        oddRowBackground,
      },
      data,
      headerCounter,
      onLeftGridCellClick,
      onToggleRow,
      originalArgs,
      rawData,
      rowFields,
    } = this.props;

    const firstColumnStyle = {};

    if (columnIndex === 0) {
      firstColumnStyle.paddingLeft =
        `${20 * data[headerCounter + rowIndex].depth}px`;
      if (rowFields.length === 1 ||
        data[headerCounter + rowIndex].depth < rowFields.length - 1) {
        firstColumnStyle.cursor = 'pointer';
      }
    }

    return (
      <div
        className="cell"
        key={key}
        style={{
          ...firstColumnStyle,
          ...evenOddRowStyle({
            columnIndex,
            evenRowBackground,
            oddRowBackground,
            rowIndex,
          }),
          ...style,
          borderLeft: `1px solid ${this.props.colorPack.gridBorders}`,
          borderRight: `1px solid ${this.props.colorPack.gridBorders}`,
          borderBottom: `1px solid ${this.props.colorPack.gridBorders}`,
        }}
        onClick={rowHeaderOnClick.bind(this, {
          collapsedRows,
          columnIndex,
          data,
          headerCounter,
          onLeftGridCellClick,
          originalArgs,
          rawData,
          rowIndex,
          onToggleRow,
        })}
      >
        <div className="cell-text-container">
          <div className="arrow">
            {
              columnIndex === 0 ?
                arrowStyle({
                  checkIfInCollapsed,
                  colFields,
                  rowFields,
                  data,
                  headerCounter,
                  rowIndex,
                }) :
                ''
            }
          </div>
          <div className="cell-data">
            {
              data.length ?
                data[headerCounter + rowIndex].value[columnIndex] :
                ''
            }
          </div>
        </div>
      </div>
    );
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

    const height = (window.innerHeight - (headerCounter * rowHeight)) - 100;

    return (
      <section className="react-virtualized-pivot-module-table">
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
                scrollWidth,
              }) => {
                return (
                  <div className="GridRow">
                    <div
                      className="LeftSideGridContainer"
                      style={{
                        color: colorPack.leftHeaderCellText,
                        height: headerHeight * headerCounter,
                        width: leftColumnWidth,
                        zIndex: 2,
                      }}
                    >
                      <Grid
                        ref={(input) => { this.header = input; }}
                        cellRenderer={this.renderLeftHeaderCell}
                        className="HeaderGrid"
                        style={{
                          backgroundColor: colorPack.headerGridBackground,
                          borderBottom: `1px solid ${colorPack.gridBorders}`,
                          borderTop: `1px solid
                            ${this.props.colorPack.gridBorders}`,
                          outline: 'none',
                        }}
                        width={leftColumnWidth}
                        height={headerCounter ? headerHeight * headerCounter :
                          headerHeight}
                        rowHeight={headerHeight}
                        columnWidth={leftColumnWidth}
                        rowCount={headerCounter ? headerCounter : 1}
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
                        style={{
                          backgroundColor: colorPack.leftSideGridBackground,
                          outline: 'none',
                        }}
                        height={height - scrollbarSize()}
                        rowHeight={rowHeight}
                        rowCount={rowCount === 0 ?
                          0 :
                          (rowCount - headerCounter)
                        }
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
                                height: headerHeight * headerCounter,
                                width: width - scrollbarSize(),
                                backgroundColor: colorPack.headerGridBackground,
                              }}
                            >
                              <Grid
                                ref={(input) => { this.grid = input; }}
                                className="HeaderGrid"
                                columnWidth={this.getColumnWidth}
                                columnCount={columnCount > 0 ?
                                  columnCount - 1 :
                                  0
                                }
                                height={headerHeight * headerCounter}
                                overscanColumnCount={overscanColumnCount}
                                cellRenderer={this.renderHeaderCell}
                                rowHeight={headerHeight}
                                rowCount={headerCounter}
                                scrollLeft={scrollLeft}
                                width={width - scrollbarSize()}
                                style={{
                                  outline: 'none',
                                }}
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
                                style={{
                                  backgroundColor: colorPack.bodyGridBackground,
                                  outline: 'none',
                                }}
                                columnWidth={this.getColumnWidth}
                                columnCount={columnCount > 0 ?
                                  columnCount - 1 :
                                  0
                                }
                                height={height}
                                onScroll={onScroll}
                                overscanColumnCount={overscanColumnCount}
                                overscanRowCount={overscanRowCount}
                                cellRenderer={this.renderBodyCell}
                                rowHeight={rowHeight}
                                rowCount={rowCount === 0 ?
                                  0 :
                                  (rowCount - headerCounter)
                                }
                                width={width}
                              />
                            </div>
                          </div>
                        )}
                      </AutoSizer>
                    </div>
                  </div>
                );
              }}
            </ScrollSync>
          </section>
        </div>
      </section>
    );
  }
}

Table.propTypes = {
  checkIfInCollapsed: PropTypes.func.isRequired,
  colorPack: PropTypes.object.isRequired,
  columnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  headerCounter: PropTypes.number.isRequired,
  headerHeight: PropTypes.number.isRequired,
  onToggleRow: PropTypes.func.isRequired,
  overscanColumnCount: PropTypes.number.isRequired,
  overscanRowCount: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  rowFields: PropTypes.array.isRequired,
  colFields: PropTypes.array.isRequired,
  rowHeight: PropTypes.number.isRequired,
};
