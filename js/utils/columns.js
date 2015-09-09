const React = require('react'),
      moment = require('moment'),
      { Input, Col, Button, Modal, ModalTrigger, Row } = require('react-bootstrap'),
      ConfiginatorConstants = require('../constants/configinatorconstants'),
      CronPicker = require('./cronpicker'),
      d3 = require('d3');

const CustomPager = React.createClass({
    propTypes: {
      setPage: React.PropTypes.func.isRequired,
      currentPage: React.PropTypes.number.isRequired,
      maxPage: React.PropTypes.number,
      previous: React.PropTypes.func,
      nextText: React.PropTypes.string,
      previousText: React.PropTypes.string,
      count: React.PropTypes.number,
      next: React.PropTypes.func
    },
    getDefaultProps: function(){
        return {
            'count': 0,
            'maxPage': 0,
            'nextText': '',
            'previousText': '',
            'currentPage': 0
        };
    },
    pageChange: function(event){
        this.props.setPage(parseInt(((event.target.value - 1)), 10));
    },
    render: function(){
        let previous = '';
        let next = '';

        if(this.props.currentPage > 0){
            previous = <Button onClick={this.props.previous} className='previous'>{this.props.previousText}</Button>;
        }

        if(this.props.currentPage !== (this.props.maxPage - 1)){
            next = <Button onClick={this.props.next} className='next'>{this.props.nextText}</Button>;
        }

        let options = [];

      let startIndex = 0;
      let endIndex = this.props.maxPage;

        for(let i = startIndex; i < endIndex; i++){
            options.push(<option key = {i}>{i + 1}</option>);
        }
        return (
            <Row className='row custom-pager'>
                <Col xs = {5}>{previous}</Col>
                <Col xs = {4}>
                    <Input value = {1 + this.props.currentPage} type='select' onChange = {this.pageChange} className = "smallSelect">
                      {options}
                    </Input>
                    <span> {"/ "}{this.props.maxPage} </span>
                    <span> ({this.props.count} results) </span>
                </Col>
                <Col xs = {3} className = 'right'>{next}</Col>
            </Row>
        );
    }
});


const SelectComponent = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  propTypes: {
    metadata: React.PropTypes.object,
    data: React.PropTypes.any,
    rowData: React.PropTypes.object
  },
  onClick(e){
    e.preventDefault();
    if(this.props.metadata.clickCallback){
      this.props.metadata.clickCallback(this.props.rowData, this.props.metadata);
    }
  },
  render(){
    return (
      <Col md={1}>
        <Input style = {{ marginLeft: '5px' }} onClick = {this.onClick} checked = {this.props.data} type="checkbox" />
      </Col>
    );
  }
});


const ConfirmModal = React.createClass({
  propTypes: {
    onRequestHide: React.PropTypes.func.isRequired,
    confirmText: React.PropTypes.string,
    confirmButtonText: React.PropTypes.string,
    rowData: React.PropTypes.object,
    metadata: React.PropTypes.object
  },
  getDefaultProps(){
    return {
      confirmText: 'Are you sure you want to remove this item?',
      confirmButtonText: 'Remove Item'
    };
  },
  confirmClicked(){
    this.props.metadata.confirmCallback(this.props.rowData, this.props.metadata);
    this.props.onRequestHide();
  },
 render(){
   const confirmText = this.props.metadata.confirmText || this.props.confirmText,
         confirmButtonText = this.props.metadata.confirmButtonText || this.props.confirmButtonText;
   return (
    <Modal {...this.props} title='Confirm Removal'
      backdrop={false}
      animation={true} >
      <div className='modal-body'>
        {confirmText}
      </div>
      <div className='modal-footer'>
        <Button onClick = {this.props.onRequestHide} >Cancel</Button>
        <Button onClick = {this.confirmClicked} bsStyle='danger'>{confirmButtonText}</Button>
      </div>
    </Modal>
   );
 }
});

const definedModalTypes = {
    confirm: ConfirmModal
};

const ModalComponent = React.createClass({
  propTypes: {
    metadata: React.PropTypes.object,
    data: React.PropTypes.any,
    rowData: React.PropTypes.object
  },
  render() {
    const metadata = this.props.metadata,
          text = (metadata.customCellText) ? metadata.customCellText : this.props.data,
          ModalToRender = metadata.modalToRender || definedModalTypes[metadata.modalType];
    return (
      <ModalTrigger modal = {<ModalToRender {...this.props} />}>
        <a href="#">
          {text}
        </a>
      </ModalTrigger>
    );
  }
});

const LinkComponent = React.createClass({
    propTypes: {
        metadata: React.PropTypes.object,
        data: React.PropTypes.any,
        rowData: React.PropTypes.object
    },

    render: function(){
        const text = (this.props.metadata.customCellText) ? this.props.metadata.customCellText : this.props.data;
        return <a href={text} target="_blank">login</a>
    }
});
const ClickComponent = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  propTypes: {
    metadata: React.PropTypes.object,
    data: React.PropTypes.any,
    rowData: React.PropTypes.object
  },
    handleDetailClick(){
        this.context.router.transitionTo('/resources/userdetailview');
    },
    onClick(e){
    e.preventDefault();
    if(this.props.metadata.clickCallback){
      this.props.metadata.clickCallback(this.props.rowData, this.props.metadata);
    }

  },
  render(){
    const text = (this.props.metadata.customCellText) ? this.props.metadata.customCellText : this.props.data;
    return (
        <div>
           <a href="#" onClick={this.onClick}>Login</a> |
           <a href="#" onClick={this.handleDetailClick}>Details</a>
        </div>
    );
  }
});

const StatusComponent = React.createClass({
  propTypes: {
    rowData: React.PropTypes.object.isRequired,
    metadata: React.PropTypes.object.isRequired,
    key: React.PropTypes.string
  },
  getStatus(status){
    const statusMap = ConfiginatorConstants.Statuses[this.props.metadata.statusMap] ? ConfiginatorConstants.Statuses[this.props.metadata.statusMap] : {};
    return (statusMap[status]) ? statusMap[status] : status;
  },
  render(){
    const key = this.props.metadata.rowKey || 'status';
    const status = this.getStatus(this.props.rowData[key]);
    return (
      <span className = {'status' + status}>
        {status}
      </span>
    );
  }
});

const ObjectRender = React.createClass({
  propTypes: {
    rowData: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    metadata: React.PropTypes.object.isRequired
  },
  render(){
    const objectToParse = this.props.rowData[this.props.metadata.objectToParse] || this.props.data;
    const cell = (objectToParse && objectToParse[this.props.metadata.attr]) ? objectToParse[this.props.metadata.attr] : '';
   return (
    <span>
      {cell}
    </span>
   );
  }
});


const BarRender = React.createClass({
  propTypes: {
    rowData: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    metadata: React.PropTypes.object.isRequired
  },
  render(){
    const objectToParse = this.props.rowData[this.props.metadata.objectToParse] || this.props.data;
    const cell = (objectToParse && objectToParse[this.props.metadata.attr]) ? objectToParse[this.props.metadata.attr] : 0;
    const cellWidth = cell + 1;
    const cellLabel = typeof cell === 'number' ? cell.toFixed(2) : cell;
   return (
     <svg height = "25" width = "185px" className = "inlineBar">
     <g transform = 'translate(0,0)'>
      <text x = "0" y="9" dy=".45em">{cellLabel}</text>
     </g>
      <g transform = 'translate(35,0)'>
        <rect title = {cellLabel} height = "25" width = {cellWidth * 50 + '%'} />
      </g>
     </svg>
   );
  }
});


const LocalizedTime = React.createClass({//move to common area after demo
  propTypes: {
    data: React.PropTypes.string,
    metadata: React.PropTypes.object.isRequired
  },
  onClick(e){
    e.preventDefault();
    if(this.props.metadata.clickCallback){
      this.props.metadata.clickCallback(this.props.rowData, this.props.metadata);
    }
  },
  render(){
    const time = this.props.data ? moment(this.props.data).format('MMM Do YYYY, h:mm:ss A') : '';
    return (this.props.metadata.clickCallback)
    ? (<a href = "#" onClick = {this.onClick}>{time} </a>)
    : (<span>{time}</span>);
  }
});


const BooleanRender = React.createClass({//move to common area after demo
  propTypes: {
    data: React.PropTypes.string
  },
  render(){
    const displayBoolean = this.props.data ? 'True' : 'False';
    return (<span>{displayBoolean}</span>);
  }
});

const CronTabComponent = React.createClass({//move to common area after demo
  propTypes: {
    data: React.PropTypes.string
  },
  render(){
    return (<span>{CronPicker.parseValue(this.props.data)}</span>);
  }
});

const RatingComponent = React.createClass({
    colorScale () {
        return d3.scale.linear()
                 .domain([-1, 0, 1])
                 .range(['red', 'white', 'green']);
    },
    xScale (width) {
        return d3.scale.linear()
                 .domain([-1, 1])
                 .range([0, width]);
    },
    computeWidth (width) {
        return width - this.props.margin.left - this.props.margin.right;
    },
    computeHeight (height) {
        return height - this.props.margin.top - this.props.margin.bottom;
    },
    getInitialState() {
        const width = this.computeWidth(this.props.width),
              height = this.computeHeight(this.props.height);
        return {
            width: width,
            height: height,
            uncomputedWidth: this.props.width,
            uncomputedHeight: this.props.height,
            xScale: this.xScale(width),
            colorScale: this.colorScale()
        };
    },
    componentDidMount () {
        if (typeof this.props.data === 'number') {
            this.state.chart = d3.select(this.refs.chart.getDOMNode());
            this.state.line = d3.select(this.refs.line.getDOMNode());
            this.state.label = d3.select(this.refs.label.getDOMNode());
            this.refs.svg.getDOMNode().parentNode.parentNode.classList.add('resource-row');
        } else {
            this.state.axis = d3.select(this.refs.axis.getDOMNode());
            if (this.props.rowData.expandOnLoad) {
                this.refs.svg.getDOMNode().parentNode.click();
            }
        }
        this.chartUpdate();
    },
    propTypes: {
        margin: React.PropTypes.object,
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        data: React.PropTypes.number,
        rowData: React.PropTypes.object,
        metadata: React.PropTypes.object.isRequired
    },
    getDefaultProps () {
        return {
            margin: {top: 0, right: 30, bottom: 0, left: 30},
            height: 30,
            width: 450
        };
    },
    chartUpdate () {
        if (typeof this.props.data === 'number') {
            this.bar();
            //this.line();
            this.labels();
        } else {
            this.axis();
        }
    },
    bar () {
        const chart = this.state.chart,
              xScale = this.state.xScale,
              colorScale = this.state.colorScale,
              height = this.state.height;
        chart.selectAll('.rbar')
             .data([this.props.data])
             .enter()
             .append('rect')
             .attr('class', function(d) {
                  return d < 0 ? 'rbar negative' : 'rbar positive';
              })
             .attr('x', function(d) {
                  return d > 0 ? xScale(0) : xScale(d);
              })
             .attr('y', function() {
                  return 0;
              })
             .attr('width', function(d) {
                  return Math.abs(xScale(d) - xScale(0));
              })
             .attr('height', height)
             .attr('fill', function (d) {
                  return colorScale(d);
              });
    },
    line () {
        const line = this.state.line,
              zeroX = this.state.xScale(0);
        line.append('line')
            .attr('x1', zeroX)
            .attr('x2', zeroX)
            .attr('y1', 0)
            .attr('y2', this.state.height)
            .attr('stroke', '#000000')
            .attr('stroke-width', '1');
    },
    labels () {
        const label = this.state.label,
              xScale = this.state.xScale,
              d = this.props.data;
        label.append('text')
             .text(this.props.data.toFixed(2))
             .attr('x', function() {
                 let xPos = xScale(d);
                 xPos = d < 0 ? xPos - 30 : xPos + 5;
                 return xPos;
             })
             .attr('y', function() {
                 return 20;
             })
             .attr('font-family', 'sans-serif')
             .attr('font-size', '11px')
             .attr('class', 'bar_labels')
             .attr('fill', 'black');
    },
    axis () {
        const axisG = this.state.axis,
              xScale = this.state.xScale,
              axis = d3.svg.axis()
                       .scale(xScale)
                       .orient('top');
        axisG.call(axis);
    },
    render () {
        const margin = this.props.margin,
              height = this.state.uncomputedHeight,
              width = this.state.uncomputedWidth,
              topLevelMessage = this.props.metadata.topLevelMessage || 'Expand to view details';
        let transform = 'translate(' + margin.left + ',' + margin.top + ')';
        let svgToRender, placeholderText;
        if (typeof this.props.data === 'number') {
            svgToRender = (
                <g>
                    <g ref="chart" transform={transform}/>
                    <g ref="line" transform={transform}/>
                    <g ref="label" transform={transform}/>
                </g>
            );
        } else {
            transform = 'translate(' + (margin.left) + ',' + (margin.top + 20) + ')';
            svgToRender = (
                <g ref="axis" className="axis" transform={transform}/>
            );
            placeholderText = (
                <span className="text">{topLevelMessage}</span>
            );
        }
        return (
            <div>
                <svg className="chart" ref="svg" width={width} height={height}>
                    {svgToRender}
                </svg>
                {placeholderText}
            </div>
        );
    }
});
const BytesDisplayComponent = React.createClass({//move to common area after demo
  propTypes: {
    data: React.PropTypes.string
  },
  render () {
    let bytes = this.props.data;
    if (bytes >= 1073741824) {
          bytes = ( bytes / 1073741824 ).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
          bytes = ( bytes / 1048576 ).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
          bytes = ( bytes / 1024 ).toFixed(2) + ' KB';
    } else if (bytes > 1) {
          bytes = bytes + ' bytes';
    } else if (bytes === 1) {
          bytes = bytes + ' byte';
    } else {
          bytes = '0 byte';
    }
    return (
        <span>
            {bytes}
        </span>
    );
  }
});


module.exports = {
  CustomPager: CustomPager,
  BarRender: BarRender,
  BooleanRender: BooleanRender,
  ModalComponent: ModalComponent,
  LinkComponent: LinkComponent,
  SelectComponent: SelectComponent,
  LocalizedTime: LocalizedTime,
  ObjectRender: ObjectRender,
  ClickComponent: ClickComponent,
  StatusComponent: StatusComponent,
  CronTabComponent: CronTabComponent,
  RatingComponent: RatingComponent,
  BytesDisplayComponent: BytesDisplayComponent
};
