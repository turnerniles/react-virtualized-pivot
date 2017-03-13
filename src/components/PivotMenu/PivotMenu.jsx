import React from 'react';
import Pivot from 'quick-pivot';
import Select from 'react-select-plus';
import Sortable from 'react-sortablejs';
import PivotGrid from '../PivotGrid/PivotGrid.jsx';
import 'react-select-plus/dist/react-select-plus.css';
import './styles.scss';

export default class PivotMenu extends React.Component{
	constructor(props){
		super(props);

		this.state = {
				aggregationDimensions: this.props.data[0].map((item, index) => {
					return {value: item, label: item}
				}),
				colFields: [],
				pivot: {},
				dataArray: this.props.data,
				fields: this.props.data[0],
				rowFields: [],
				selectedAggregationType: 'sum',
				selectedAggregationDimension: 'age',
    };

		this.onSelectAggregationDimension = this.onSelectAggregationDimension.bind(this);
		this.onSelectAggregationType = this.onSelectAggregationType.bind(this);
		this.onAddUpdateField = this.onAddUpdateField.bind(this);
		this.onToggleRow = this.onToggleRow.bind(this);
		this.checkIfInCollapsed = this.checkIfInCollapsed.bind(this);
	}

	componentWillReceiveProps (nextProps) {
    this.setState({
			aggregationDimensions: nextProps.data[0].map((item, index) => {
				return {value: item, label: item}
			}),
			data: nextProps.data,
			dataArray: nextProps.data,
			fields: nextProps.data[0],
			selectedAggregationDimension: '',
			colFields: [],
			rowFields: [],
		})
  }

	render() {
		const {
			aggregationDimensions,
			pivot,
			selectedAggregationType,
			selectedAggregationDimension,
		} = this.state;

		const aggregationTypes = [
	    { value: 'sum', label: 'sum' },
	    { value: 'count', label: 'count' },
		];

		//We are not using deconstructed state consts here due to
		// react-sortablejs bug
		const fields = this.state.fields.map((field, index) =>
			(<li key={index} data-id={field}>{field}</li>));
		const rowFieldsRender = this.state.rowFields.map((field, index) =>
			(<li key={index} data-id={field}>{field}</li>));
		const colFieldsRender = this.state.colFields.map((field, index) =>
			(<li key={index} data-id={field}>{field}</li>));

		return(
			<section className="quick-pivot">
				<div className="pivot-options">
	       <div className="selectors-container">
						<div className="select-container">
	          <div className="title">Aggregation Type</div>
							<Select
							    name="Aggregation Type"
									value={this.state.selectedAggregationType}
							    options={aggregationTypes}
							    onChange={this.onSelectAggregationType}
									menuContainerStyle={{ zIndex: 2000 }}
							/>
         	</div>

         	<div className="select-container">
	          <div className="title">Aggregation Dimension</div>
							<Select
									name="Aggregation Type"
									value={this.state.selectedAggregationDimension}
									options={aggregationDimensions}
									onChange={this.onSelectAggregationDimension}
									menuContainerStyle={{ zIndex: 2000 }}
							/>
	      	</div>
	       </div>

					<div className="fields">
						<div className="title">Fields</div>
		        <Sortable
							className="sortable-container block__list block__list_tags"
							onChange={fields => this.setState({fields})}
	            options={{
	              group: 'shared',
	              onAdd: this.onAddUpdateField,
	            }}
	            tag="ul"
						>
		        	{fields}
		        </Sortable>
	        </div>

	        <div className="rows">
						<div className="title">Rows</div>
		        <Sortable
							className="sortable-container block__list block__list_tags"
							onChange={rowFields => this.setState({rowFields})}
	            options={{
                group: 'shared',
                onAdd: this.onAddUpdateField,
                onUpdate: this.onAddUpdateField,
	            }}
	            tag="ul"
						>
		          {rowFieldsRender}
		        </Sortable>
	        </div>

	        <div className="columns">
						<div className="title">Columns</div>
		        <Sortable
							className="sortable-container block__list block__list_tags"
							onChange={(colFields) => this.setState({colFields})}
	            options={{
                group: 'shared',
                onAdd: this.onAddUpdateField,
                onUpdate: this.onAddUpdateField,
	            }}
	            tag="ul"
						>
		          {colFieldsRender}
		        </Sortable>
	        </div>
        </div>

				<div className="pivot-grid">
					<PivotGrid
						toggleRow={this.onToggleRow}
						rowFieldsLength={this.state.rowFields.length}
						data={Object.keys(pivot).length ? pivot.data.table : []}
						checkIfInCollapsed={this.checkIfInCollapsed}
					>
					</PivotGrid>
				</div>
			</section>
		);
	}

	onSelectAggregationType (selectedAggregationType) {
		const {
			colFields,
			dataArray,
			rowFields,
			selectedAggregationDimension,
		} = this.state;

		const pivotedData = new Pivot(
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension,
			selectedAggregationType.value,
		);

		this.setState({
			pivot: pivotedData,
			selectedAggregationType: selectedAggregationType.value,
		})
	}

	onSelectAggregationDimension (selectedAggregationDimension) {
		const {
			colFields,
			dataArray,
			rowFields,
			selectedAggregationType,
		} = this.state;

		const pivotedData = new Pivot(
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension.value,
			selectedAggregationType,
		);

		this.setState({
			pivot: pivotedData,
			selectedAggregationDimension: selectedAggregationDimension.value,
		})
	}

	onAddUpdateField (event) {
		const {
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension,
			selectedAggregationType,
		} = this.state;

		const pivotedData = new Pivot(
			dataArray,
			rowFields,
			colFields,
			selectedAggregationDimension,
			selectedAggregationType,
		);

		this.setState({pivot: pivotedData});
	}

	onToggleRow(rowIndex) {
		const newPivot = this.state.pivot.toggle(rowIndex);

		this.setState({pivot: newPivot});
	}

	checkIfInCollapsed(rowIndex){
		return (rowIndex in this.state.pivot.collapsedRows) ? true : false
	}
}
