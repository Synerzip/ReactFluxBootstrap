const React = require('react'),
    FilterMixin = require('./mixins/filter'),
    NumberRangeFilter = require('./filters/numberrange'),
    DateRangeFilter = require('./filters/daterange'),
    { Input } = require('react-bootstrap'),
    { Multiselect } = require('react-widgets');

const TextFilter = React.createClass({
    mixins: [FilterMixin],
    render () {
        const attributes = this.props.attributes;
        return (
            <Input onChange={this.onChange} type="text" value={this.props.value} placeholder="Enter text"
                   label={attributes.displayName}/>
        );
    }
});

const ListFilter = React.createClass({
    mixins: [FilterMixin],
    propTypes: {
        attributes: React.PropTypes.array,
        value: React.PropTypes.string.isRequired
    },
    render () {
        const attributes = this.props.attributes,
            emptyOption = attributes.noEmptyOption ? '' : (<option value="">Select value</option>);
        return (
            <Input type="select" value={this.props.value} onChange={this.onChange} label={attributes.displayName}>
                {emptyOption}
                {attributes.data.map(function (attribute, index) {
                    return <option key={index} value={attribute.parameter}>{attribute.displayName}</option>;
                })}
            </Input>
        );
    }
});

const MultiListFilter = React.createClass({
    mixins: [FilterMixin],
    multiOnChange (values) {
        const result = values.map(function (value) {
            return value.parameter;
        });
        this.props.onChange(result.length > 0 ? result.join(',') : null);
    },
    render () {
        const attributes = this.props.attributes;
        let value = this.props.value;
        if (typeof value === 'string') {
            value = value.split(',');
        }
        return (
            <div>
                <label className="control-label">
                    <span>{attributes.displayName}</span>
                </label>
                <Multiselect data={attributes.data} valueField='parameter' textField='displayName' value={value}
                             onChange={this.multiOnChange}/>
            </div>
        );
    }
});

const FilterTypes = {
    text: TextFilter,
    list: ListFilter,
    multiList: MultiListFilter,
    numberRange: NumberRangeFilter,
    dateRange: DateRangeFilter
};

const FilterWrapper = React.createClass({
    propTypes: {
        attributes: React.PropTypes.object.isRequired,
        value: React.PropTypes.string.isRequired,
        allValues: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    onChange(value, objectAsValue = false) {
        const attributes = this.props.filterAttr;
        let data = {};
        if (objectAsValue) {
            data = value;
        } else {
            data[attributes.parameter] = value;
        }
        this.props.onChange(data);
    },
    render () {
        const attributes = this.props.filterAttr;
        const FilterType = FilterTypes[attributes.type];
        return (
            <FilterType onChange={this.onChange} value={this.props.filterValues} allValues={this.props.allValues}
                        attributes={attributes}/>
        );
    }
});

module.exports = FilterWrapper;
