/* jshint esnext: true */
const Router = require('react-router'),
    LandingNavBar = require('../components/navigation/landingnavbar'),
    React = require('react');

const { RouteHandler } = Router;

const ConsoleLayout = React.createClass({
  propTypes(){
    return {};
  },
  render() {
    return (
      <div>
        <LandingNavBar {...this.props} />

        <RouteHandler {...this.props} />

      </div>
    );
  }

});

module.exports = ConsoleLayout;
