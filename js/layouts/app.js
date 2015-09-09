/* jshint esnext: true */
const React = require('react'),
  UserStore = require('../stores/userstore'),
  Config = require('../config'),
  Permissions = require('../components/mixins/permissions'),
  Constants = require('../constants/configinatorconstants'),
  { RouteHandler } = require('react-router'),
  _ = require('lodash');

const App = React.createClass({
  propTypes: {
    path: React.PropTypes.string
  },
  mixins: [Permissions],
  contextTypes: {
    router: React.PropTypes.func
  },
  /**
   * Determines if a path is public (no auth needed)
   * @param {String} path
   */
  weAreInPublic(path){
    let publicPaths = [//I'd love to find a way to declare these in the routes attributes
      'login'
    ];
    publicPaths = publicPaths.map(publicPath => Config.ROUTE_PREFIX + publicPath);//add route prefix to all paths

    return publicPaths.indexOf(path) !== -1;
  },
  /**
   * Returns boolean to indicate if the user is logged in
   */
  weAreLoggedIn(){
    return this.state.session.loggedIn;
  },
  /**
   * Loads the initial state from stores
   */
  getInitialState() {
    return _.extend({}, this.getStateFromStores(), {textReady: false});
  },
  /**
   * Adds listener on the UserStore and checks auth
   */
  componentDidMount() {
    this.buildLoggedInDefault();
    UserStore.addChangeListener(this._onChange);
    this.authCheck();
  },
  buildLoggedInDefault(){
    this.loggedInDefault = Config.ROUTE_PREFIX + this.getDefaultHomeRoute();
  },
  _onTextChange () {
      this.setState({
          textReady: true
      });
  },
  /**
   * Calls auth Check
   */
  componentWillReceiveProps() {
    this.authCheck();
  },
  /**
   * Removes listener from UserStore
   */
  componentWillUnmount(){
    UserStore.removeChangeListener(this._onChange);
  },
  /**
   * Queries the UserStore for session data
   */
  getStateFromStores(){
    return {
      session: UserStore.get('session'),
      grantedPermissions: UserStore.getAllGrantedPermissions()
    };
  },
  /**
   * Fired on UserStore changes, refreshes state variable and performs authcheck
   */
  _onChange(){
    this.setState(this.getStateFromStores());
    this.buildLoggedInDefault();
    this.authCheck();
  },
  /**
   * Checks to ensure non authorized users can't access priv'd routes
   * Transition logged in users to console dashvoard
   */
  authCheck(){
    if (this.props.path.substr(0, 11) === '/console/v2'){//any old v2 url should be visible so we can show redirect message
      return true;
    }
    else if(this.weAreLoggedIn() && (this.weAreInPublic(this.props.path) || this.props.path === Config.ROUTE_PREFIX)){
      this.context.router.transitionTo(this.loggedInDefault);
    }
    else if(!this.weAreLoggedIn() && !this.weAreInPublic(this.props.path)){
     this.context.router.transitionTo(Constants.Locations.LOGGED_OUT_DEFAULT);
    }
  },
  /**
   * Renders the App layout, gives session props to all child layouts
   */
  render() {
      return (
        <div>
          <RouteHandler {...this.props} session = {this.state.session} />
        </div>
      );
  }

});


module.exports = App;
