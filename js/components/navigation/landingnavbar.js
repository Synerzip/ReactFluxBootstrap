/* jshint esnext: true */
const React = require('react'),
    { Nav, Navbar } = require('react-bootstrap');

const LandingNavBar = React.createClass({
  propTypes: {
    path: React.PropTypes.string,
    name: React.PropTypes.string
  },
  render: function() {
    /* jshint ignore:start */
    const brand = <a className="brand" href="/"><img className="mycompany-logo" src="/static/configinator_admin_console/images/mycompany_logo.png"/></a>;
    return (
      <Navbar className= "user" inverse={true} brand={brand} fluid={true}>
        <Nav />
      </Navbar>
    );
    /* jshint ignore:end */
  }

});

module.exports = LandingNavBar;
