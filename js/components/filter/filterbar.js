const React = require('react'),
      FilterWrapper = require('./filterwrapper'),
      _ = require('lodash'),
      QSManage = require('../mixins/qsmanage'),
      { Grid, Row, Col } = require('react-bootstrap');
/**
 * attributes is an array of objects which contain three
 * keys [type, displayName, data* (can be undefined for some types), parameter]
**/
const FilterBar = React.createClass({
    contextTypes: {
      router: React.PropTypes.func
    },
    mixins: [ QSManage ],
    propTypes: {
        attributes: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.object
    },
    getDefaultProps () {
        return {
            value: {}
        };
    },
    omitNullsPickCallback (val) {
        return !!val;
    },
    onChange (value) {
        value = value || {};
        let data = _.extend({}, this.props.value, value);
        data = _.pick(data, this.omitNullsPickCallback);
        const QSParams = _.pick(data, _.identity);
        this.mergeQueryParams({filter: QSParams});
        this.props.onChange(data);
    },
    renderRow (start, end) {
        const value = this.props.value,
              attributes = this.props.attributes;
        return (
            <Row>
                {attributes.slice(start, end).map(function(filterAttributes, index) {
                    const filterValue = value [filterAttributes.parameter] || null;
                    return (
                        <Col sm={12} md={2} key={index}>
                            <FilterWrapper attributes={filterAttributes} value={filterValue} onChange={this.onChange} allValues={value}/>
                        </Col>
                    );
                }, this)}
            </Row>
        );
    },
    render () {
        return (
            <div className="filter-bar">
                <div className="title">Filter By</div>
                <Grid className="align-left" fluid={true}>
                    {this.renderRow(0, 6)}
                    {this.renderRow(6, 12)}
                </Grid>
            </div>
        );
    }
});

module.exports = FilterBar;
