const React = require('react'),
      FilterMixin = require('../mixins/filter'),
      Timezone = require('../../../utils/timezone'),
      { Button, Glyphicon, OverlayTrigger, Popover } = require('react-bootstrap'),
      { DateTimePicker } = require('react-widgets'),
      moment = require('moment'),
      _ = require('lodash');

const DateRangeFilter = React.createClass({
    mixins: [FilterMixin],
    renderPopover () {
        const attributes = this.props.attributes,
              defaultStartDate = attributes.defaultStartDate || null,
              defaultEndDate = attributes.defaultEndDate || null,
              timezone = attributes.timezone,
              maxDate = timezone ? moment(moment.utc().utcOffset(timezone).format(), 'YYYY-M-D').toDate() : new Date(),
              maxStartValue = endDateValue || maxDate,
              parseString = 'YYYY-M-D',
              clearAll = attributes.hideClearAll ? null : (<div className="clear-bar"><a onClick={this.clearAll}>Clear all</a></div>);
        let { startDateValue, endDateValue } = this.getDateValues();
        startDateValue = startDateValue && moment(startDateValue.format(parseString), parseString).toDate();
        endDateValue = endDateValue && moment(endDateValue.format(parseString), parseString).toDate();
        return (
            <Popover title='' className="date-range-popover">
                <label className="control-label">
                    <span>Start Date</span>
                </label>
                <DateTimePicker time={false} defaultValue={defaultStartDate} value={startDateValue} onChange={this.changeStartDate} max={maxStartValue}/>
                <label className="control-label">
                    <span>End Date</span>
                </label>
                <DateTimePicker time={false} defaultValue={defaultEndDate} value={endDateValue} onChange={this.changeEndDate} max={maxDate} min={startDateValue}/>
                {clearAll}
            </Popover>
        );
    },
    clearAll () {
        const parameter = this.props.attributes.parameter,
              parameters = this.props.attributes.parameters;
        let data = {};
        if (_.isString(parameter)) {
            data[parameter + '__gte'] = null;
            data[parameter + '__lte'] = null;
        }
        if (_.isArray(parameters) && parameters.length === 2) {
            data[parameters[0]] = null;
            data[parameters[1]] = null;
        }
        this.props.onChange(data, true);
    },
    getDateValues() {
        const parameter = this.props.attributes.parameter,
              parameters = this.props.attributes.parameters;
        let startDateValue, endDateValue;
        if (_.isString(parameter)) {
            startDateValue = this.props.allValues[parameter + '__gte'] || null;
            endDateValue = this.props.allValues[parameter + '__lte'] || null;
        }
        if (_.isArray(parameters) && parameters.length === 2) { 
            startDateValue = this.props.allValues[parameters[0]] || null;
            endDateValue = this.props.allValues[parameters[1]] || null;
        }
        startDateValue = startDateValue && this.createGenericDate(startDateValue);
        endDateValue = endDateValue && this.createGenericDate(endDateValue).subtract(1, 'day');
        return {
            startDateValue,
            endDateValue
        };
    },
    createGenericDate(dateString) {
        const timezone = this.props.attributes.timezone || null,
              isUTC = this.props.attributes.isUTC || false,
              parseString = 'YYYY-M-D';
        let momentDate = null;
        if (_.isString(dateString)) {
            momentDate = isUTC ? moment.utc(dateString, parseString) : moment(dateString, parseString);
        }
        if (timezone && momentDate) {
            momentDate.zone(timezone);
            Timezone.reverseTimezoneOffset(momentDate, timezone);
        }
        return momentDate;
    },
    createGenericDateString (date) {
        if (_.isDate(date)) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }
        return null;
    },
    changeStartDate (value) {
        this.changeDate('__gte', value);
    },
    changeEndDate (value) {
        this.changeDate('__lte', value);
    },
    changeDate (parameterPostfix, value) {
        const parameter = this.props.attributes.parameter,
              parameters = this.props.attributes.parameters,
              dateString = this.createGenericDateString(value);
        let date = this.createGenericDate(dateString),
            data = {};
        if (parameterPostfix === '__lte' && date) {
            date.add(1, 'day');
        }
        date = date && date.format();
        if (_.isString(parameter)) {
            data[parameter + parameterPostfix] = date;
        }
        if (_.isArray(parameters) && parameters.length === 2) {
            data[parameterPostfix === '__gte' ? parameters[0] : parameters[1]] = date;
        }
        this.props.onChange(data, true);
    },
    truncateYear(str) {
        const re = /20([0-9]{2})/;
        return str.replace(re, '$1');
    },
    render () {
        const attributes = this.props.attributes,
              { startDateValue, endDateValue } = this.getDateValues();
        let buttonMsg = [];
        if (startDateValue) {
            let prefix = endDateValue ? '' : 'from ';
            buttonMsg.push(prefix + this.truncateYear(moment(startDateValue).format('l')));
        }
        if (endDateValue) {
            let prefix = startDateValue ? ' - ' : 'through ';
            buttonMsg.push(prefix + this.truncateYear(moment(endDateValue).format('l')));
        }
        if (buttonMsg.length === 0) {
            buttonMsg.push('Select Date(s)');
        }
        return (
            <div>
                <label className="control-label">
                    <span>{attributes.displayName}</span>
                </label>
                <OverlayTrigger trigger='click' rootClose={true} placement='bottom' overlay={this.renderPopover()}>
                    <Button className='date-range-filter' bsSize='medium' active>{buttonMsg.join(' ')} <Glyphicon glyph='chevron-down'/></Button>
                </OverlayTrigger>
            </div>
        );
    }
});

module.exports = DateRangeFilter;
