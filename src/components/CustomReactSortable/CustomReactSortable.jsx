/* eslint consistent-return: 0 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SortableJS from './CustomSortable';

const store = {
  nextSibling: null,
  activeComponent: null,
};

class Sortable extends Component {
    static propTypes = {
      options: PropTypes.object,
      onChange: PropTypes.func,
      tag: PropTypes.string,
      style: PropTypes.object,
    };
    static defaultProps = {
      options: {},
      tag: 'div',
      style: {},
    };
    sortable = null;

    componentDidMount() {
      const options = { ...this.props.options };

      [
        'onChoose',
        'onStart',
        'onEnd',
        'onAdd',
        'onUpdate',
        'onSort',
        'onRemove',
        'onFilter',
        'onMove',
        'onClone',
      ].forEach((name) => {
        const eventHandler = options[name];

        options[name] = (...params) => {
          const [evt] = params;

          if (name === 'onChoose') {
            store.nextSibling = evt.item.nextElementSibling;
            store.activeComponent = this;
          } else if ((name === 'onAdd' || name === 'onUpdate') &&
          this.props.onChange) {
            const items = this.sortable.toArray();
            const remote = store.activeComponent;
            const remoteItems = remote.sortable.toArray();

            const referenceNode = (store.nextSibling &&
              store.nextSibling.parentNode !== null) ?
              store.nextSibling : null;

            evt.from.insertBefore(evt.item, referenceNode);
            if (remote !== this) {
              const remoteOptions = remote.props.options || {};

              if ((typeof remoteOptions.group === 'object') &&
              (remoteOptions.group.pull === 'clone')) {
                // Remove the node with the same data-reactid
                evt.item.parentNode.removeChild(evt.item);
              }

              remote.props.onChange &&
              remote.props.onChange(remoteItems, remote.sortable, evt);
            }

            this.props.onChange &&
            this.props.onChange(items, this.sortable, evt);
          }

          if (evt.type === 'move') {
            const [evt, originalEvent] = params;
            const canMove = eventHandler ?
              eventHandler(evt, originalEvent) : true;

            return canMove;
          }

          setTimeout(() => {
            eventHandler && eventHandler(evt);
          }, 0);
        };
      });

      this.sortable = SortableJS.create(ReactDOM.findDOMNode(this), options);
    }
    componentWillUnmount() {
      if (this.sortable) {
        this.sortable.destroy();
        this.sortable = null;
      }
    }
    render() {
      const { tag: Component, ...props } = this.props;

      delete props.options;
      delete props.onChange;

      return (
        <Component {...props} />
      );
    }
}

export default Sortable;
