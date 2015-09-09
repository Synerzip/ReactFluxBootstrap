const React = require('react'),
      FilterMixin = require('../mixins/filter'),
      { Button, Glyphicon, OverlayTrigger, Popover } = require('react-bootstrap'),
      { NumberPicker } = require('react-widgets');

const NumberRangeFilter = React.createClass({
    mixins: [FilterMixin],
    renderPopover () {
        const attributes = this.props.attributes,
              step = attributes.step || 1,
              format = attributes.format || null,
              precision = attributes.precision || null,
              defaultStartValue = attributes.defaultStartDate || null,
              defaultEndValue = attributes.defaultEndDate || null,
              { startValue, endValue } = this.getValues(),
              maxStartValue = endValue || null,
              minStartValue = startValue ? startValue : null,
              minEndValue = endValue ? startValue : 0;
        return (
            <Popover title='' className="number-range-popover">
                <label className="control-label">
                    <span>Start Value</span>
                </label>
                <NumberPicker defaultValue={defaultStartValue} value={startValue} onChange={this.changeStartValue} min={0} step={step} format={format} precision={precision}/>
                <label className="control-label">
                    <span>End Value</span>
                </label>
                <NumberPicker defaultValue={defaultEndValue} value={endValue} onChange={this.changeEndValue} min={minEndValue} step={step} format={format} precision={precision}/>
                <div className="clear-bar"><a onClick={this.clearAll}>Clear all</a></div>
            </Popover>
        );
    },
    clearAll () {
        const parameter = this.props.attributes.parameter;
        let data = {};
        data[parameter + '__gte'] = null;
        data[parameter + '__lte'] = null;
        this.props.onChange(data, true);
    },
    getValues() {
        const parameter = this.props.attributes.parameter;
        let startValue = this.props.allValues[parameter + '__gte'] || null,
            endValue = this.props.allValues[parameter + '__lte'] || null;
        startValue = Number(startValue) || null;
        endValue = Number(endValue) || null;
        return {
            startValue,
            endValue
        };
    },
    changeStartValue (value) {
        this.changeValue('__gte', value);
    },
    changeEndValue (value) {
        const parameter = this.props.attributes.parameter,
              gteValue = this.props.allValues[parameter + '__gte'];
        value = Math.max(Number(gteValue), value);
        this.changeValue('__lte', value);
    },
    changeValue (parameterPostfix, value) {
        const parameter = this.props.attributes.parameter,
              data = {};
        data[parameter + parameterPostfix] = Number(value) || null;
        this.props.onChange(data, true);
    },
    render () {
        const attributes = this.props.attributes,
              precision = attributes.precision || 0,
              { startValue, endValue } = this.getValues();
        let buttonMsg = [];
        if (startValue) {
            let prefix = endValue ? '' : 'from '; 
            buttonMsg.push(prefix + startValue.toFixed(precision));
        }
        if (endValue) {
            let prefix = startValue ? ' - ' : 'through '; 
            buttonMsg.push(prefix + endValue.toFixed(precision));
        }
        if (buttonMsg.length === 0) {
            buttonMsg.push('Select Values(s)');
        }
        return (
            <div>
                <label className="control-label">
                    <span>{attributes.displayName}</span>
                </label>
                <OverlayTrigger trigger='click' rootClose={true} placement='bottom' overlay={this.renderPopover()}>
                    <Button className='number-range-filter' bsSize='medium' active>{buttonMsg.join(' ')} <Glyphicon glyph='chevron-down'/></Button>
                </OverlayTrigger>
            </div>
        );
    }
});

module.exports = NumberRangeFilter;
