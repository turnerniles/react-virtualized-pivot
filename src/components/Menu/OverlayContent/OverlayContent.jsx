import React, { PureComponent } from 'react';
import VirtualizedCheckbox from
  '../../CustomReactVirtualizedCheckbox/CustomReactVirtualizedCheckbox.js';

export default class OverlayContent extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      filters,
      currentFilter,
      currentValues,
      onFiltersOk,
      onFiltersCancel,
    } = this.props;

    return (
      <VirtualizedCheckbox
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
          (checked, unchecked, allChecked, filter) => {
            onFiltersOk({checked, unchecked, allChecked, filter});
          }
        }
        onCancel={() => onFiltersCancel()}
      />
    );
  }
}
