const React = require('react'),
    ConfiginatorActions = require('../../actions/configinatoractions'),
    { Nav, NavItem, Navbar, Glyphicon, OverlayTrigger, Popover, DropdownButton, MenuItem } = require('react-bootstrap'),
    Permissions = require('../mixins/permissions'),
    StoreSync = require('../mixins/storesync'),
    UserStore = require('../../stores/userstore');

const Navigation = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    mixins: [Permissions, StoreSync],
    getDefaultProps(){
        return {
            stores: [
                UserStore
            ]
        };
    },
    getStateFromStores(){
        return {
            grantedPermissions: UserStore.getAllGrantedPermissions()
        };
    },
    propTypes: {
        path: React.PropTypes.string,
        name: React.PropTypes.string
    },
    preventDefault(e){
        e.preventDefault();
    },
    logoutClick(e){
        this.preventDefault(e);
        ConfiginatorActions.logout();
        this.context.router.transitionTo("login");
    },

    toHome () {
        ConfiginatorActions.toggleSideNav(true);
        this.context.router.transitionTo(this.getDefaultHomeRoute());
    },
    toggle(){
        ConfiginatorActions.toggleSideNav();
    },
    render: function() {
        const style = {color: 'white'};
        return (
            <Navbar collapsible={true} className= "user" inverse={true} fluid={true}>
                <Nav style={style}>
                    <NavItem onClick={this.toHome} className="navbar-brand" style={{padding: '0px'}}><img className="mycompany-logo" src="/static/configinator_admin_console/images/mycompany_logo.png"/></NavItem>
                </Nav>

                <Nav right>
                    <DropdownButton title={<Glyphicon glyph='user' />} ref="settings" noCaret className="settings-button">
                        <MenuItem onClick={this.logoutClick} eventKey='2'>Logout</MenuItem>
                    </DropdownButton>
                </Nav>
            </Navbar>
        );
    }

});

module.exports = Navigation;
