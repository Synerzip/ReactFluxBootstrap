const Router = require('react-router'),
    TestComponent = require('../components/resources/newTest'),
    React = require('react'),
    LandingNavBar = require('../components/navigation/landingnavbar')

const { RouteHandler } = Router;

const TestLayout = React.createClass({


    render() {

        return (
            <div>
                <LandingNavBar {...this.props} style= {{minHeight: '53px'}} />
                <RouteHandler />
            </div>
        );
    }

});

module.exports = TestLayout;
