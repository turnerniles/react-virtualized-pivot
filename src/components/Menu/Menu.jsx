import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import ReactSortable from '../CustomReactSortable/CustomReactSortable.jsx';
// import Drawer from 'react-md/lib/Drawers';
// import ReactDrawer from 'react-drawer';
// import Toolbar from 'react-md/lib/Toolbars';
import OverlayContent from './OverlayContent/OverlayContent.jsx';
// import RightArrowIcon from '../../icons/RightArrowIcon.jsx';
import Drawer from './Drawer/Drawer.jsx';

// import './react-md.scss';
// import 'react-drawer/lib/react-drawer.css';
import styles from './styles.scss';

export default class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.filterButtonClick = this.filterButtonClick.bind(this);
  }

  filterButtonClick(field, e) {
    this.props.showFilterMenu(field);
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
    };

    const fieldsRenderer = fields.length ?
      fields.map((field, index) => {
        return (
          <li
            className={styles['fields-draggable-li']}
            ref={ref => { this.fieldsOverlayButton = ref; }}
            key={index}
            data-id={field}
            style={{
              backgroundColor: colorPack.sortableFieldBackground,
              color: colorPack.sortableFieldText,
            }}
          >
            <div className={styles['inner-filter-container']}
              onMouseDown={(e) => {
                onFiltersCancel();
              }}
            >
              <div className={styles['filter-text']}
              >
                {field}
              </div>
              <div
                className={styles['filter-button']}
                onClick={this.filterButtonClick.bind(this, field)}
              >
              ✎
              </div>
            </div>
            {(currentValues.length > 0 && currentFilter === field) &&
            <div className={styles['filter-menu']}
            >
              <div
                className={styles['filters-container']}
                style={{ position: 'absolute',
                  ...divStyle, height: 200, width: 150 }}
              >
                <OverlayContent
                  filters={filters}
                  currentFilter={currentFilter}
                  currentValues={currentValues}
                  onFiltersOk={onFiltersOk}
                  onFiltersCancel={onFiltersCancel}
                />
              </div>
            </div>
            }
          </li>
        );
      }) :
      '';

    const rowFieldsRender = rowFields.map((field, index) =>
      (
        <li
          className={styles['fields-draggable-li']}
          key={index}
          data-id={field}
          style={{
            backgroundColor: colorPack.sortableFieldBackground,
            color: colorPack.sortableFieldText,
          }}
        >
          <div className={styles['inner-filter-container']}
            onMouseDown={(e) => {
              onFiltersCancel();
            }}
          >
            <div className={styles['filter-text']}
            >
              {field}
            </div>
            <div
              className={styles['filter-button']}
              onClick={this.filterButtonClick.bind(this, field)}
            >
            ✎
            </div>
          </div>
          {(currentValues.length > 0 && currentFilter === field) &&
          <div className={styles['filter-menu']}
          >
            <div
              className={styles['filters-container']}
              style={{ position: 'absolute',
                ...divStyle, height: 200, width: 150 }}
            >
              <OverlayContent
                filters={filters}
                currentFilter={currentFilter}
                currentValues={currentValues}
                onFiltersOk={onFiltersOk}
                onFiltersCancel={onFiltersCancel}
              />
            </div>
          </div>
          }
        </li>
      ));

    const colFieldsRender = colFields.map((field, index) =>
      (
        <li
          className={styles['fields-draggable-li']}
          key={index}
          data-id={field}
          style={{
            backgroundColor: colorPack.sortableFieldBackground,
            color: colorPack.sortableFieldText,
          }}
        >
          <div className={styles['inner-filter-container']}
            onMouseDown={(e) => {
              onFiltersCancel();
            }}
          >
            <div className={styles['filter-text']}
            >
              {field}
            </div>
            <div
              className={styles['filter-button']}
              onClick={this.filterButtonClick.bind(this, field)}
            >
            ✎
            </div>
          </div>
          {(currentValues.length > 0 && currentFilter === field) &&
          <div className={styles['filter-menu']}
          >
            <div
              className={styles['filters-container']}
              style={{ position: 'absolute',
                ...divStyle, height: 200, width: 150 }}
            >
              <OverlayContent
                filters={filters}
                currentFilter={currentFilter}
                currentValues={currentValues}
                onFiltersOk={onFiltersOk}
                onFiltersCancel={onFiltersCancel}
              />
            </div>
          </div>
          }
        </li>
      ));

    const menuItems = (
      <div className={styles['pivot-options']}>
        <div className={styles['selectors-container']}>
          <div className={styles['select-container']}>
            <div
              className={styles['title']}
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

          <div className={styles['select-container']}>
            <div
              className={styles['title']}
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

        <div className={styles['fields-drag-container']}>
          <div className={styles['fields']}>
            <div
              className={styles['title']}
              style={{
                'backgroundColor': colorPack.selectorContainerTitleBackground,
                'color': colorPack.selectorContainerTitleText,
              }}
            >
                Fields
            </div>
            <div
              className={[
                styles['dog'],
                styles['sortable-container'],
                styles['block__list'],
                styles['block__list_tags'],
              ].join(' ')}
            >
              <ReactSortable
                className={[
                  styles['dog'],
                  styles['sortable-container'],
                  styles['block__list'],
                  styles['block__list_tags'],
                ].join(' ')}
                style={{
                  backgroundColor: colorPack.sortableContainerBackground,
                  borderColor: colorPack.sortableContainerBorderColor,
                  height: '119px',
                  marginTop: '-8px',
                  marginLeft: '10px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
                onChange={fields => setFields(fields)}
                options={{
                  group: 'shared',
                  onAdd: onAddUpdateField,
                }}
                tag="ul"
              >
                {fieldsRenderer}
              </ReactSortable>
            </div>
          </div>

          <div className={styles['rows']}>
            <div
              className={styles['title']}
              style={{
                'backgroundColor': colorPack.selectorContainerTitleBackground,
                'color': colorPack.selectorContainerTitleText,
              }}
            >
              Rows
            </div>
            <ReactSortable
              className={[
                styles['dog'],
                styles['sortable-container'],
                styles['block__list'],
                styles['block__list_tags'],
              ].join(' ')}
              style={{
                backgroundColor: colorPack.sortableContainerBackground,
                borderColor: colorPack.sortableContainerBorderColor,
              }}
              onChange={rowFields => setRowFields(rowFields)}
              options={{
                group: 'shared',
                onAdd: onAddUpdateField,
                onUpdate: onAddUpdateField,
              }}
              tag="ul"
            >
              {rowFieldsRender}
            </ReactSortable>
          </div>

          <div className={styles['columns']}>
            <div
              className={styles['title']}
              style={{
                'backgroundColor': colorPack.selectorContainerTitleBackground,
                'color': colorPack.selectorContainerTitleText,
              }}
            >
              Columns
            </div>
            <ReactSortable
              className={[
                styles['sortable-container'],
                styles['block__list'],
                styles['block__list_tags'],
              ].join(' ')}
              style={{
                backgroundColor: colorPack.sortableContainerBackground,
                borderColor: colorPack.sortableContainerBorderColor,
              }}
              onChange={colFields => setColFields(colFields)}
              options={{
                group: 'shared',
                onAdd: onAddUpdateField,
                onUpdate: onAddUpdateField,
              }}
              tag="ul"
            >
              {colFieldsRender}
            </ReactSortable>
          </div>
        </div>
      </div>
    );

    // const close = (
    //   <Button icon onClick={handleRightClose}>
    //     <RightArrowIcon
    //       color={colorPack.icons}
    //     />
    //   </Button>
    // );
    // const header = (
    //   <Toolbar
    //     nav={null}
    //     actions={close}
    //     className={[
    //       styles['md-divider-border'],
    //       styles['md-divider-border--bottom'],
    //     ].join(' ')}
    //   />
    // );

    return (
      <Drawer
        isDrawerOpen={isDrawerOpen}
        handleRightClose={handleRightClose}
      >
        {menuItems}
      </Drawer>
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
