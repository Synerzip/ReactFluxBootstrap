const Router = require('react-router'),
    TestComponent = require('../components/resources/newTest'),
    React = require('react'),
    LandingNavBar = require('../components/navigation/landingnavbar')

const { RouteHandler } = Router;

const TestLayout = React.createClass({


    render() {

        return (
            <div>
                <LandingNavBar {...this.props} />
                <RouteHandler />
            </div>
        );
    }

});

module.exports = TestLayout;
