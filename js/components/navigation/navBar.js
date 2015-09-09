/**
 * Created by synerzip on 20/8/15.
 */
const React = require('react'),
    _ = require('lodash'),
    Permissions = require('../mixins/permissions'),
{Row,Col,Nav,NavItem,Grid,Glyphicon} =  require('react-bootstrap')


var MenuNav = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    mixins: [Permissions],
    getInitialState(){
        console.log('insidenavbar component');
        return {
            key:1,
        };
    },

    handleSelect:function (number) {
        this.setState({key:number});
    },
    toEnvironment () {
        this.setState({key:1});
        this.context.router.transitionTo("/resources/deploymentdefinitions");
    },
    toHome () {
        this.setState({key:1});
        //this.context.router.transitionTo(this.getDefaultHomeRoute());
        this.context.router.transitionTo('/resources/newtest');
    },

    render() {
        var gridStyle = {verticalAlign: 'top'};
        var divStyle={float:'left',marginLeft:'-29px'};
        var navigatorStyle = {backgroundColor: '#E9E9E9',color:'black',fontFamily:'Open Sans'};
        var navitemstyle = {paddingRight: '10px'};
        var columnStyle = {borderWidth:"1px", borderStyle:"solid", borderColor:"gray"};
        var number=this.state.key;
        return (
                <Nav className="sideNav" bsStyle='pills' activeKey={2} style={navigatorStyle} stacked  >
                 <NavItem onClick={this.toHome}  eventKey={1}>
                     <Glyphicon glyph='home' />
                     Home
                 </NavItem>
                 <NavItem  eventKey={2} onClick={this.toEnvironment}>
                     <Glyphicon glyph='list-alt' />
                      Environment
                 </NavItem>
                 <NavItem onClick={this.toHome} eventKey={3}>
                     <Glyphicon glyph='cog' />
                      User Management
                 </NavItem>
                  <NavItem onClick={this.toHome} eventKey={4}>
                      <Glyphicon glyph='bookmark' />
                      Feature Flags
                  </NavItem>
                  <NavItem onClick={this.toHome} eventKey={5}>
                      <Glyphicon glyph='stats' />
                      Reports
                  </NavItem>
                  <NavItem onClick={this.toHome} eventKey={6} onClick={this.toHome}>
                      <Glyphicon glyph = 'sort' />
                      Activity Feed
                  </NavItem>
                </Nav>

        );
    }
});

module.exports = MenuNav;



