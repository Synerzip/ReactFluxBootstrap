const React = require('react'),
      { Input } = require('react-bootstrap'),
      _ = require('lodash'),
      { DaysInAWeek, MonthsAbbr } = require('../constants/configinatorconstants');

const CronInput = React.createClass({
  statics: {
    parseValue (value) {
      const splitValue = typeof value === 'string' ? value.split(' ') : null;
      if (splitValue && splitValue.length >= 5) {
          const minute = splitValue[0],
                hour = splitValue[1],
                day = splitValue[2],
                month = splitValue[3],
                dayOfWeek = splitValue[4],
                period = this.getPeriod(minute, hour, day, month, dayOfWeek);
          let result = 'every ' + period;
          switch (period) {
              case 'hour':
                  result += ' at ' + (Number(minute) + 1) + ' minutes';
                  break;
              case 'day':
                  result += ' at ' + (Number(hour) + 1) + ':' + (Number(minute) + 1);
                  break;
              case 'week':
                  result += ' on ' + DaysInAWeek[Number(dayOfWeek)] + ' at ' + (Number(hour) + 1) + ':' + (Number(minute) + 1);
                  break;
              case 'month':
                  result += ' on the ' + day + ' at ' + (Number(hour) + 1) + ':' + (Number(minute) + 1);
                  break;
              case 'year':
                  result += ' on the ' + day + ' of ' + MonthsAbbr[Number(month) - 1] + ' at ' + (Number(hour) + 1) + ':' + (Number(minute) + 1);
                  break;
          }
          return result;
      }
      return '';
    },
    getPeriod (minute, hour, day, month, dayOfWeek) {
      const isNumber = function (value) {
          return !_.isNaN(Number(value));
      };
      if (isNumber(minute) && isNumber(hour) && isNumber(day) && isNumber(month)) {
          return 'year';
      } else if (isNumber(minute) && isNumber(hour) && isNumber(day)) {
          return 'month';
      } else if (isNumber(minute) && isNumber(hour) && isNumber(dayOfWeek)) {
          return 'week';
      } else if (isNumber(minute) && isNumber(hour)) {
          return 'day';
      } else if (isNumber(minute)) {
          return 'hour';
      }
      return '';
    }
  },
  getInitialState() {
    return {
        period: this.props.defaultPeriod,
        minute: null,
        hour: null,
        day: null,
        dayOfWeek: null,
        month: null,
        value: this.props.value
    };
  },
  getDefaultProps () {
      return {
          onChange: _.noop,
          value: '',
          defaultPeriod: null
      };
  },
  propTypes: {
      onChange: React.PropTypes.func,
      value: React.PropTypes.string,
      defaultPeriod: React.PropTypes.string,
      bsStyle: React.PropTypes.string,
      hasFeedback: React.PropTypes.bool,
      label: React.PropTypes.string
  },
  emitValue(){
      this.props.onChange(this.state.value);
  },
  nonePeriodDefaults: {
      minute: null,
      hour: null,
      day: null,
      dayOfWeek: null,
      month: null,
      value: null
  },
  hourPeriodDefaults: {
      minute: 0,
      hour: null,
      day: null,
      dayOfWeek: null,
      month: null
  },
  dayPeriodDefaults: {
      minute: 0,
      hour: 0,
      day: null,
      dayOfWeek: null,
      month: null
  },
  weekPeriodDefaults: {
      minute: 0,
      hour: 0,
      day: null,
      dayOfWeek: 1,
      month: null
  },
  monthPeriodDefaults: {
      minute: 0,
      hour: 0,
      day: 1,
      dayOfWeek: null,
      month: null
  },
  yearPeriodDefaults: {
      minute: 0,
      hour: 0,
      day: 1,
      dayOfWeek: null,
      month: 1
  },
  renderPeriod () {
      const extendibleProps = {
          label: 'Period'
      };
      if (this.props.bsStyle === 'error') {
          _.extend(extendibleProps, {
              bsStyle: this.props.bsStyle,
              hasFeedback: this.props.hasFeedback,
              label: this.props.label
          });
      }
      return (
          <Input className="period" type="select" ref="period" label="Period" value={this.state.period} onChange={this.selectPeriod} {...extendibleProps}>
              <option value="none" selected>None</option>
              <option value="hour">hour</option>
              <option value="day">day</option>
              <option value="week">week</option>
              <option value="month">month</option>
              <option value="year">year</option>
          </Input>
      );
  },
  renderPeriodOptions () {
      switch (this.state.period) {
          case 'hour':
              return this.renderHourPeriod();
          case 'day':
              return this.renderDayPeriod();
          case 'week':
              return this.renderWeekPeriod();
          case 'month':
              return this.renderMonthPeriod();
          case 'year':
              return this.renderYearPeriod();
          default:
              return null;
      }
  },
  renderHourPeriod () {
      return (
          <div className="period-options">
              <span className="conjunction">at</span>
              {this.renderMinutes()}
              <span className="conjunction">minutes past the hour</span>
          </div>
      );
  },
  renderDayPeriod () {
      return (
          <div className="period-options">
              <span className="conjunction">at</span>
              {this.renderHours()}
              <span className="conjunction">:</span>
              {this.renderMinutes()}
          </div>
      );
  },
  renderWeekPeriod () {
      return (
          <div className="period-options">
              <span className="conjunction">on</span>
              {this.renderDaysOfWeek()}
              <span className="conjunction">at</span>
              {this.renderHours()}
              <span className="conjunction">:</span>
              {this.renderMinutes()}
          </div>
      );
  },
  renderMonthPeriod () {
      return (
          <div className="period-options">
              <span className="conjunction">on the</span>
              {this.renderDays()}
              <span className="conjunction">at</span>
              {this.renderHours()}
              <span className="conjunction">:</span>
              {this.renderMinutes()}
          </div>
      );
  },
  renderYearPeriod () {
      return (
          <div className="period-options">
              <span className="conjunction">on the</span>
              {this.renderDays()}
              <span className="conjunction">of</span>
              {this.renderMonths()}
              <span className="conjunction">at</span>
              {this.renderHours()}
              <span className="conjunction">:</span>
              {this.renderMinutes()}
          </div>
      );
  },
  renderDays () {
      const daysArray = Array.apply(null, Array(31));
      return (
          <Input className="day" type="select" ref="day" label="Day" value={this.state.day} onChange={this.selectDays}>
              {daysArray.map(function(value, index) {
                 value = index + 1;
                 return <option value={value}>{value}</option>;
              })}
          </Input>
      );
  },
  renderDaysOfWeek () {
      return (
          <Input className="dayOfWeek" type="select" ref="dayOfWeek" label="Day of Week" value={this.state.dayOfWeek} onChange={this.selectDaysOfWeek}>
              {DaysInAWeek.map(function(value, index) {
                 return <option value={index}>{value}</option>;
              })}
          </Input>
      );
  },
  renderMonths () {
      return (
          <Input className="month" type="select" ref="month" label="Month" value={this.state.month} onChange={this.selectMonths}>
              {MonthsAbbr.map(function(value, index) {
                 const optionValue = index + 1;
                 return <option value={optionValue}>{value}</option>;
              })}
          </Input>
      );
  },
  renderHours () {
      const hoursArray = Array.apply(null, Array(24));
      return (
         <Input className="hour" type="select" ref="hour" label="Hour" value={this.state.hour} onChange={this.selectHours}>
              {hoursArray.map(function(value, index) {
                 return <option value={index}>{index}</option>;
              })}
          </Input>
      );
  },
  renderMinutes () {
      const minutesArray = Array.apply(null, Array(60));
      return (
         <Input className="hour" type="select" ref="hour" label="Minute" value={this.state.minute} onChange={this.selectMinutes}>
              {minutesArray.map(function(value, index) {
                 return <option value={index}>{index}</option>;
              })}
          </Input>
      );
  },
  //event callbacks to all selections
  calcValue () {
      let result = null;
      if (this.state.period !== 'none') {
          result = this.calcPart(this.state.minute);
          result += this.calcPart(this.state.hour);
          result += this.calcPart(this.state.day);
          result += this.calcPart(this.state.month);
          result += this.calcPart(this.state.dayOfWeek);
          result += '*';
      }
      this.setState({
          value: result
      }, this.emitValue);
  },
  calcPart (part) {
      return _.isNumber(part) ? part + ' ' : '* ';
  },
  getValue() {
      return this.state.value;
  },
  parseValue () {
      const splitValue = this.state.value.split(' '),
            minute = splitValue[0],
            hour = splitValue[1],
            day = splitValue[2],
            month = splitValue[3],
            dayOfWeek = splitValue[4],
            period = this.constructor.getPeriod(minute, hour, day, month, dayOfWeek);

      this.setState({
          minute,
          hour,
          day,
          month,
          dayOfWeek,
          period
      });
  },
  componentWillMount () {
      if (typeof this.state.value === 'string' && this.state.value.length > 0) {
          this.parseValue();
      }
  },
  selectPeriod(e) {
      const period = e.target.value,
            defaults = this[period + 'PeriodDefaults'],
            newState = _.extend({}, {period: period}, defaults);
      this.setState(newState, this.calcValue);
  },
  selectDays(e) {
      this.setState({
          day: Number(e.target.value)
      }, this.calcValue);
  },
  selectDaysOfWeek(e) {
      this.setState({
          dayOfWeek: Number(e.target.value)
      }, this.calcValue);
  },
  selectMonths(e) {
      this.setState({
          month: Number(e.target.value)
      }, this.calcValue);
  },
  selectHours(e) {
      this.setState({
          hour: Number(e.target.value)
      }, this.calcValue);
  },
  selectMinutes(e) {
      this.setState({
          minute: Number(e.target.value)
      }, this.calcValue);
  },
  render() {
      return (
          <div className="cron-picker">
              <span>Every&nbsp;</span>
              {this.renderPeriod()}
              {this.renderPeriodOptions()}
          </div>
      );
  }
});

module.exports = CronInput;
