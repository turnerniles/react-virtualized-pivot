import React, { PureComponent } from 'react'
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../ContentBox/ContentBox.jsx'
import cn from 'classnames'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import './styles.scss'

export default class PivotGrid extends PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      columnWidth: 75,
      columnCount: this.props.data.length || 0,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount: (this.props.data.length && props.data[0].value.length) ?
        this.props.data[0].value.length : 0,
    }

    this.renderBodyCell = this.renderBodyCell.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.renderLeftHeaderCell = this.renderLeftHeaderCell.bind(this);
    this.renderLeftSideCell = this.renderLeftSideCell.bind(this);
  }

  render () {
    const {
      columnCount,
      columnWidth,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
    } = this.state

    return (
      <section className='pivot-grid'>
        <ContentBox>
        <ScrollSync>
          {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => {
            const x = scrollLeft / (scrollWidth - clientWidth);
            const y = scrollTop / (scrollHeight - clientHeight);
            const leftColor = '#ffffff';
            const topColor = '#ffffff';
            const middleColor = '#ffffff';

            return (
              <div className="GridRow">
                <div
                  className="LeftSideGridContainer"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: leftColor,
                  }}
                >
                  <Grid
                    ref={(input) => { this.header = input; }}
                    cellRenderer={this.renderLeftHeaderCell}
                    className={'HeaderGrid'}
                    width={columnWidth}
                    height={rowHeight}
                    rowHeight={rowHeight}
                    columnWidth={columnWidth}
                    rowCount={1}
                    columnCount={1}
                  />
                </div>
                <div
                  className="LeftSideGridContainer"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: rowHeight,
                    color: leftColor,
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
                    height={height - scrollbarSize()}
                    rowHeight={rowHeight}
                    rowCount={rowCount}
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
                            color: topColor,
                            height: rowHeight,
                            width: width - scrollbarSize(),
                          }}
                        >
                          <Grid
                            ref={(input) => { this.grid = input; }}
                            className="HeaderGrid"
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={this.renderHeaderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width - scrollbarSize()}
                          />
                        </div>
                        <div
                          style={{
                            color: middleColor,
                            height,
                            width,
                          }}
                        >
                          <Grid
                            ref={(input) => { this.bodyGrid = input; }}
                            className="BodyGrid"
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={height}
                            onScroll={onScroll}
                            overscanColumnCount={overscanColumnCount}
                            overscanRowCount={overscanRowCount}
                            cellRenderer={this.renderBodyCell}
                            rowHeight={rowHeight}
                            rowCount={rowCount}
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
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        columnCount: nextProps.data.length ? nextProps.data[0].value.length : 0,
        rowCount: nextProps.data.length,
      })

      this.header.recomputeGridSize(
        {columnIndex: 0, rowIndex: 0},
      )
      this.leftHeader.recomputeGridSize(
        {columnIndex: 0, rowIndex: 0},
      )
      this.grid.recomputeGridSize(
        {columnIndex: 0, rowIndex: 0},
      )      
      this.bodyGrid.recomputeGridSize(
        {columnIndex: 0, rowIndex: 0},
      )
    }
  }

  renderBodyCell ({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return
    }
    return this.renderLeftSideCell ({ columnIndex, key, rowIndex, style })
  }

  renderHeaderCell ({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return
    }
    return this.renderLeftHeaderCell ({ columnIndex, key, rowIndex, style })
  }

  renderLeftHeaderCell ({ columnIndex, key, rowIndex, style }) {
    return (
      <div
        className={'headerCell'}
        key={key}
        style={style}
      >
        {`${this.props.data.length ?
          this.props.data[0].value[columnIndex] : ''}`}
      </div>
    )
  }

  renderLeftSideCell ({ columnIndex, key, rowIndex, style }) {
    const rowClass = rowIndex % 2 === 0
      ? columnIndex % 2 === 0 ? 'evenRow' : 'oddRow'
      : columnIndex % 2 !== 0 ? 'evenRow' : 'oddRow'
    const classNames = cn(rowClass, 'cell');

    return (
      <div
        className={classNames}
        key={key}
        style={style}
      >
        {`${this.props.data.length ?
          this.props.data[rowIndex].value[columnIndex] : ''}`}
      </div>
    )
  }
}
