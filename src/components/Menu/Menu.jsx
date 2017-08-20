import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import ReactSortable from '../CustomReactSortable/CustomReactSortable.jsx';
import Drawer from 'react-md/lib/Drawers';
import VirtualizedCheckbox from
  '../CustomReactVirtualizedCheckbox/CustomReactVirtualizedCheckbox.js';
import { Modal, Position } from 'react-overlays';

import './styles.scss';

export default class Menu extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      colorPack,
      selectedAggregationType,
      aggregationTypes,
      onSelectAggregationType,
      selectedAggregationDimension,
      aggregationDimensions,
      onSelectAggregationDimension,
      fields,
      filters,
      currentValues,
      showFilterMenu,
      colFields,
      rowFields,
      onAddUpdateField,
      setFields,
      setRowFields,
      setColFields,
      currentFilter,
      onFiltersOk,
      onFiltersCancel,
      isDrawerOpen,
      handleRightClose,
    } = this.props;

    const divStyle = {
      backgroundColor: 'white',
      border: 'solid 1px',
      boxShadow: '0 5px 15px #9d9d9d',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '90%',
      height: '100%',
      justifyContent: 'space-between',
      padding: '3px',
      zIndex: 100,
      left: '-500px',
    };

    const fieldsRenderer = fields.length ?
      fields.map((field, index) => {
        return (
          <li
            ref={ref => { this.overlayButton = ref; }}
            key={index}
            data-id={field}
            style={{
              backgroundColor: colorPack.sortableFieldBackground,
              color: colorPack.sortableFieldText,
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
          </li>
        );
      }) :
      '';
    const rowFieldsRender = rowFields.map((field, index) =>
      (
        <li
          key={index}
          data-id={field}
          style={{
            backgroundColor: colorPack.sortableFieldBackground,
            color: colorPack.sortableFieldText,
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
            <VirtualizedCheckbox
              style={{width: '500px'}}
              items={filters[currentFilter] !== undefined ?
                currentValues.map((item) => {
                  if (filters[currentFilter].indexOf(item) > -1) {
                    return {
                      label: item, checked: false,
                    };
                  }
                  return {
                    label: item, checked: true,
                  };
                }) : currentValues.map((item) => {
                  return {
                    label: item, checked: true,
                  };
                })
              }
              rowHeight={20}
              onOk={
                (all, checked, textFilter) => {
                  onFiltersOk({all, checked, textFilter});
                }
              }
              onCancel={() => onFiltersCancel()}
            />
          </div>
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
            color: colorPack.sortableFieldText,
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
            <VirtualizedCheckbox
              style={{width: '500px'}}
              items={filters[currentFilter] !== undefined ?
                currentValues.map((item) => {
                  if (filters[currentFilter].indexOf(item) > -1) {
                    return {
                      label: item, checked: false,
                    };
                  }
                  return {
                    label: item, checked: true,
                  };
                }) : currentValues.map((item) => {
                  return {
                    label: item, checked: true,
                  };
                })
              }
              rowHeight={20}
              onOk={
                (all, checked, textFilter) => {
                  onFiltersOk({all, checked, textFilter});
                }
              }
              onCancel={() => onFiltersCancel()}
            />
          </div>
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
              style={{
                backgroundColor: colorPack.sortableContainerBackground,
                borderColor: colorPack.sortableContainerBorderColor,
              }}
              onChange={fields => setFields(fields)}
              options={{
                group: 'shared',
                onAdd: onAddUpdateField,
                onMove: () => {
                  console.log('hello');
                  onFiltersCancel();
                },
              }}
              tag="ul"
            >
              {(currentValues.length > 0) &&
                <div
                  className="filter-menu"
                  style={{
                    display: currentValues.length > 0 ? 'inline-block' : 'none',
                  }}
                >
                  <div className="filters-container">
                    <Modal
                      autoFocus={false}
                      show={currentValues.length > 0}
                      keyboard={false}
                      target={this.overlayButton}
                      container={document.body}
                      backdropStyle={{ position: 'fixed', top: 0, bottom: 0,
                        left: 0, right: 0, zIndex: 100}}
                    >
                      <Position
                        placement='bottom'
                        container={document.body}
                        target={this.overlayButton}
                      >
                        <div style={{ position: 'absolute',
                          ...divStyle, height: 100, width: 200 }}>
                          <VirtualizedCheckbox
                            style={{width: '500px'}}
                            items={filters[currentFilter] !== undefined ?
                              currentValues.map((item) => {
                                if (filters[currentFilter].indexOf(item) > -1) {
                                  return {
                                    label: item, checked: false,
                                  };
                                }
                                return {
                                  label: item, checked: true,
                                };
                              }) : currentValues.map((item) => {
                                return {
                                  label: item, checked: true,
                                };
                              })
                            }
                            rowHeight={20}
                            onOk={
                              (all, checked, textFilter) => {
                                onFiltersOk({all, checked, textFilter});
                              }
                            }
                            onCancel={() => onFiltersCancel()}
                          />
                        </div>
                      </Position>
                    </Modal>
                  </div>
                </div>
              }
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
              style={{
                backgroundColor: colorPack.sortableContainerBackground,
                borderColor: colorPack.sortableContainerBorderColor,
              }}
              onChange={rowFields => setRowFields(rowFields)}
              options={{
                group: 'shared',
                onAdd: onAddUpdateField,
                onUpdate: onAddUpdateField,
                onMove: () => {
                  console.log('hello');
                  onFiltersCancel();
                },
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
              style={{
                backgroundColor: colorPack.sortableContainerBackground,
                borderColor: colorPack.sortableContainerBorderColor,
              }}
              onChange={colFields => setColFields(colFields)}
              options={{
                group: 'shared',
                onAdd: onAddUpdateField,
                onUpdate: onAddUpdateField,
                onMove: () => {
                  onFiltersCancel();
                },
              }}
              tag="ul"
            >
              {colFieldsRender}
            </ReactSortable>
          </div>
        </div>
      </div>
    );

    return (
      <section className="menu">
        <Drawer
          visible={isDrawerOpen}
          position={'right'}
          overlay={true}
          onVisibilityToggle={handleRightClose}
          type={Drawer.DrawerTypes.TEMPORARY}
          style={{ zIndex: 100 }}
        >
          {menuItems}
        </Drawer>
      </section>
    );
  }
}

Menu.propTypes = {
  colorPack: PropTypes.object,
  selectedAggregationType: PropTypes.string.isRequired,
  aggregationTypes: PropTypes.array.isRequired,
  onSelectAggregationType: PropTypes.func.isRequired,
  selectedAggregationDimension: PropTypes.string.isRequired,
  aggregationDimensions: PropTypes.array.isRequired,
  onSelectAggregationDimension: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  currentValues: PropTypes.array.isRequired,
  showFilterMenu: PropTypes.func.isRequired,
  rowFields: PropTypes.array.isRequired,
  colFields: PropTypes.array.isRequired,
  onAddUpdateField: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
  setRowFields: PropTypes.func.isRequired,
  setColFields: PropTypes.func.isRequired,
  currentFilter: PropTypes.string.isRequired,
  onFiltersOk: PropTypes.func.isRequired,
  onFiltersCancel: PropTypes.func.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  handleRightClose: PropTypes.func.isRequired,
};
