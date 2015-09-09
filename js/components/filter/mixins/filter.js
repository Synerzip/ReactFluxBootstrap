const React = require('react');

const FilterMixin = {
    propTypes: {
        value: React.PropTypes.string.isRequired,
        allValues: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        attributes: React.PropTypes.object.isRequired
    },
    onChange(e) {
        this.props.onChange(e.target.value);
    }
};

module.exports = FilterMixin;
