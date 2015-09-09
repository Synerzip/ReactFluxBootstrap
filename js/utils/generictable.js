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
    QSParamsStore = require('../stores/qsparamsstore'),
    { CommonGriddle } = require('../constants/configinatorconstants');

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
    var gridStyle={marginLeft:'-15px'};
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



const GenericTable = React.createClass({
  hash: false,
  contextTypes: {
    router: React.PropTypes.func
  },
  propTypes: {
    stores: React.PropTypes.array.isRequired,
    xhrDeps: React.PropTypes.object.isRequired,
    getStateFromStores: React.PropTypes.func.isRequired,
    header: React.PropTypes.string,
    loadingCallback: React.PropTypes.func,
    griddleOptions: React.PropTypes.object,
    headerData: React.PropTypes.array,
    defaultFilters: React.PropTypes.array,
    defaultSort: React.PropTypes.object,
    resetPageOnFilterChange: React.PropTypes.bool,
    pagelessDatasource: React.PropTypes.bool,
    initFilterValue: React.PropTypes.object
  },
  mixins: [ StoreSync, FormMixins, QSManage ],
  getDefaultProps(){
    return {
      header: '',
      griddleOptions: {},
      formGlobalErrorMessage: 'There was a problem with your request',
      resetPageOnFilterChange: true,
      pagelessDatasource: false,
      initFilterValue: {}
    };
  },
  getStores(){
    //console.log('Inside genric table getstores()');
    return _.extend({}, this.props.stores, this.stores);
  },
  componentWillReceiveProps(){
    //console.log('Inside genric before componentWillReceiveProps()');
    this.setState(this.getStateFromStores());
    //console.log('Inside genric after componentWillReceiveProps()');
  },
  getInitialState(){
    return {
      sortKeyAscending: false,
      sortKeyColumnn: false,
      filterTextDisabled: true,
      loading: true,
      filterValue: {},
      currentPageIndex: 0,
      maxPages: 0,
      externalResultsPerPage: 10,
      externalSortColumn: null,
      externalSortAscending: true
    };
  },
  componentWillMount(){
    let state = {};
    //console.log('Inside genric before if 1 componentWillMount()');
    if(this.props.defaultFilters && this.props.defaultFilters.length > 0){
      state.filterText = this.props.defaultFilters[0].value;
      state.filterType = this.props.defaultFilters[0].key;
      state.filterTextDisabled = false;
    }
    //console.log('Inside genric before if 2 componentWillMount()');
    if(this.props.defaultSort && this.props.defaultSort.sortColumn){//todo, just call the sort callback with these default values
      state.externalSortColumn = this.props.defaultSort.sortColumn;
    }
    //console.log('Inside genric before if 3 componentWillMount()');
    if(this.props.defaultSort && this.props.defaultSort.sortDirection){
      state.externalSortAscending = (this.props.defaultSort.sortDirection === 'asc') ? true : false;
    }

    const qs = QSParamsStore.get('params') || {};
    //console.log('Inside genric before if 4 componentWillMount()');
    if(qs.pg){
      state.currentPageIndex = parseInt(qs.pg - 1, 10);
    }
    if(qs.esa){
      state.externalSortAscending = (qs.esa === 'true') ? true : false;
    }
    if(qs.esc){
      state.externalSortColumn = (qs.esc !== 'false') ? qs.esc : false;
    }
    if(qs.skc){
      state.sortKeyColumn = (qs.skc !== 'false') ? qs.skc : false;
    }
    if(qs.ska){
      qs.sortKeyAscending = (qs.ska === 'true') ? true : false;
    }
    if(qs.filter){
      state.filterValue = qs.filter;
    } else {
      state.filterValue = this.props.initFilterValue;
    }
    //console.log('Inside genric before if 5 componentWillMount()');
    this.setState(state);
  },
  setLoading(loadingState, callback){
    //console.log('Inside genric setLoading()');
    this.setState({loading: loadingState}, ()=>{
      //console.log('Inside genric setLoading if1()');
      if(this.props.loadingCallback){
        this.props.loadingCallback(this.state.loading);
      }
      //console.log('Inside genric setLoading if2()');
      if(callback){
        callback();
      }
    });
  },
  afterOnChange(){
    //console.log('Inside genric afterOnChange()');
    const maxPages = (this.state.data && this.state.data.count) ? Math.ceil(this.state.data.count / this.state.externalResultsPerPage) : 0;
    const state = {
      maxPages: maxPages
    };
    //console.log('Inside generic afterOnChange() 1');
    this.setState(state);
    //console.log('Inside generic afterOnChange() 2');

    if (!UserStore.shouldShowLoadingOverlay()){
      this.setLoading(false);
    }
  },
  getGriddleOptions() {
    //console.log('Inside generic getGriddleOptions');
    return {
      count: this.state.data ? this.state.data.count : 0,
      useCustomPagerComponent: true,
      customPagerComponent: CustomPager,
      useExternal: true,
      externalSetPage: this.setPage,
      externalChangeSort: this.changeSortDirection,
      externalSetFilter: this.setFilter,
      externalSetPageSize: this.setPageSize,
      externalMaxPage: this.state.maxPages,
      externalCurrentPage: this.state.currentPageIndex,
      results: this.state.results,
      resultsPerPage: this.state.externalResultsPerPage,
      externalSortColumn: this.state.externalSortColumn,
      externalSortAscending: this.state.externalSortAscending,
      showFilter: true,
      showSettings: false
    };
  },
  setPage(index, requestAfter=true){
    const newQSParams = {pg: (1 + index)};
    this.mergeQueryParams(newQSParams);
    this.setState({currentPageIndex: index}, requestAfter ? this.customRequest : _.noop);
  },
  changeSortDirection(column, isAscending){
    let ignoreSort = false, alternateSortKey = false, sortKeyAscending = this.state.sortKeyAscending, sortKeyColumn = false;

    if(this.props.griddleOptions.columnMetadata){
      alternateSortKey = this.props.griddleOptions.columnMetadata.find((columnMetadata)=>{//if a different key to sort on was defined in metadata, use that
        if (columnMetadata.columnName === column && columnMetadata.sortKey){
          return columnMetadata.sortKey;
        }
      });

      if(alternateSortKey){
        /*a little nasty, if we break away from the column = row attr paradigm in griddle,
         *  we now have to keep track of direction as isAscending always returns true
         *  in order for arrows to appear, we still need to trick griddle into thinking the column name is the one being sorted
         */
        column = alternateSortKey.columnName;
        sortKeyColumn = alternateSortKey.sortKey;
        sortKeyAscending = !sortKeyAscending;
      }

      ignoreSort = this.props.griddleOptions.columnMetadata.find((columnMetadata)=>{//if ignoreSort defined in metadata, block sorts
        if(columnMetadata.columnName === column && columnMetadata.ignoreSort){
          return true;
        }
      });
    }

    if(!ignoreSort){
      const state = {
        externalSortColumn: column,
        sortKeyColumn: sortKeyColumn,
        sortKeyAscending: sortKeyAscending,
        externalSortAscending: alternateSortKey ? sortKeyAscending : isAscending //if sortkey, use sortkeys asc/desc, else use griddle's isAscending
      };
      const newQsParams = {
        esc: state.externalSortColumn,
        skc: state.sortKeyColumn,
        ska: state.sortKeyAscending,
        esa: state.externalSortAscending
      };
      this.mergeQueryParams(newQsParams);
      this.setState(state, ()=>{
        this.customRequest();
      });
    }
  },
  customRequest() {
    let params = this.props.xhrDeps.params || {qs: null};

    if (!this.props.pagelessDatasource) {
      params = _.extend({}, this.props.xhrDeps.params, {
        qs: {
          limit: this.state.externalResultsPerPage,
          page: (1 + this.state.currentPageIndex)
        }
      });
    }

    if(this.state.filterValue){
      params.qs = _.extend({}, params.qs, this.state.filterValue);
    }

    if(this.state.externalSortColumn){
      const sortColumn = this.state.sortKeyColumn ? this.state.sortKeyColumn : this.state.externalSortColumn; //if a specific sortKey use that, else use normal external sort column
      const direction = this.state.externalSortAscending ? '' : '-';
      params.qs.ordering = direction + sortColumn;
    }

    let xhrDeps = _.extend({}, this.props.xhrDeps, {params: params});

    if(this.formID){
      xhrDeps.formID = this.formID;
    }

    this.setLoading(true, ()=>{
      this.pendingHash = xhrDeps.params ? JSON.stringify(xhrDeps.params) : false;
      xhrDeps.hash = this.pendingHash;
      xhrDeps.onSuccess = this.onSuccess;


      this.request(xhrDeps);


    });
  },
  onSuccess(){
    this.hash = this.pendingHash;
    this._onChange();

  },
  setFilter(filterValue){
    if (this.props.resetPageOnFilterChange) {
      this.setPage(0, false);
    }
    this.setState({filterValue: filterValue}, this.customRequest);
  },
  setPageSize(){
  },
  getStateFromStores(){
    const hash = this.hash;
    return this.props.getStateFromStores(hash);
  },
  makeCustomFilter(){
    if(Array.isArray(this.props.griddleOptions.filterableColumns)){
      const attributes = this.props.griddleOptions.filterableColumns;
      return (<FilterBar
          value = {this.state.filterValue}
          onChange = {this.setFilter}
          attributes = {attributes} />);

    }else{
      return '';
    }
  },
  makeTable(){
    const griddleOptions = this.getGriddleOptions(),

        CommonGriddleOptions = _.extend({}, CommonGriddle, griddleOptions, this.props.griddleOptions);
    const noDataMessage = this.state.loading ? '' : 'There is no data to display';
    return (
        <Row>
          <Griddle  showFilter={true} noDataMessage = {noDataMessage}  {...CommonGriddleOptions} />
        </Row>
    );
  },
  buildHeaderData(){
    if(this.props.headerData){
      return this.props.headerData.map((data, i)=>{
        const lineBreak = (i > 0 && i % 4 === 0);
        const style = (i > 0 && (i % 5 !== 0)) ? {marginLeft: '10px'} : {};
        const lineBreakMarkup = lineBreak ? (<br />) : '';
        const comma = ((1 + i) !== this.props.headerData.length && !lineBreak) ? ',' : '';
        return (<span style={style}>{data.displayName}: {data.value}{comma}{lineBreakMarkup}</span>);
      });
    }else{
      return '';
    }
  },
  /*  componentDidUpdate (prevProps) {
   console.log('Inside generic componentDidUpdate() 3');
   if (!_.isEqual(this.props.xhrDeps, prevProps.xhrDeps)) {
   console.log('Inside generic componentDidUpdate() 6');
   this.customRequest();
   console.log('Inside generic componentDidUpdate() 5');
   }else{
   console.log('Inside generic componentDidUpdate() 4');
   }

   },*/
  makeHeader(){
    if(this.props.header){
      const headerData = this.buildHeaderData();
      return (
          <Row>
            <Col md = {8}>
              <h3>{this.props.header}</h3>
              {headerData}
            </Col>
          </Row>
      );
    }

    else{
      return '';
    }
  },
  render(){
    const customFilter = this.makeCustomFilter(),
        header = this.makeHeader(),
        formGlobalError = this.renderFormGlobalError(),
        table = this.makeTable();
    return (
        <div>
          {formGlobalError}
          {header}
          {customFilter}
          {table}
        </div>
    );
  }
});

module.exports = GenericTable;