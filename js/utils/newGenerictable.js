const React = require('react'),
    Griddle = require('./s1griddle'),
    { Grid, Row, Col } = require('react-bootstrap'),
    _ = require('lodash'),
    { CustomPager } = require('./columns'),
    { FormMixins } = require('../components/mixins/formtools'),
    QSManage = require('../components/mixins/qsmanage'),
    StoreSync = require('../components/mixins/storesync'),
    UserStore = require('../stores/userstore'),
    FilterWrapper = require('../components/filter/filterwrapper'),
    QSParamsStore = require('../stores/qsparamsstore')

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
    const value = this.props.value;
    const attributes = this.props.attributes;
    return (
        <Row>
          {attributes.slice(start, end).map(function(filterAttributes, index) {
            const filterValue = value [filterAttributes.parameter] || null;
            return (
                <Col sm={12} md={2} key={index}>
                  <FilterWrapper filterAttr={filterAttributes} filterValues={filterValue} onChange={this.onChange} allValues={value}/>
                </Col>
            );
          }, this)}
        </Row>
    );
  },

  render () {
    var filterLabelStyle = {fontSize: '18px',fontFamily:"Open Sans"};
    var gridStyle={marginLeft:'0px'};
    return (
        <div className="filter-bar">
          <div style={filterLabelStyle}>Filter By</div>
          <Grid style={gridStyle} fluid={true}>
            {this.renderRow(0, 3)}
          </Grid>
        </div>
    );
  }
});



const NewGenericTable = React.createClass({

        getInitialState() {
            return {
                fakeData : [
                    {
                        "User Name": "ABC",
                        "Permission": "Pune",
                        "Edit": "MH",
                        "Delete": "India"
                    },
                    {
                        "User Name": "XYZ",
                        "Permission": "Texas",
                        "Edit": "US",
                        "Delete": "US"
                    },
                ]
            };
        },

    getGriddleOptions() {
        //console.log('Inside generic getGriddleOptions');
        return {
            results: this.state.fakeData
        };
    },
  makeTable(){
    var fakeData =  [
      {
        "User Name": "ABC",
        "Permission": "Pune",
        "Edit": "MH",
        "Delete": "India"
      },
      {
        "User Name": "XYZ",
        "Permission": "Texas",
        "Edit": "US",
        "Delete": "US"
      },

    ];


      const  CommonGriddleOptions = _.extend({}, this.props.griddleOptions);
      const noDataMessage = true ? '' : 'There is no data to display';
    return (
        <Row>
          <Griddle    {...CommonGriddleOptions} />
        </Row>
    );
  },


  render(){

    const table = this.makeTable();
    return (
        <div>
          {table}
        </div>
    );
  }
});

module.exports = NewGenericTable;