const Router = require('react-router'),
    ConfiginatorLayout = require('./layouts/configinatorlayout'),
    TestLayout = require('./layouts/testlayout'),
    UserDetailLayout = require('./layouts/userDetailLayout'),
    LandingLayout = require('./layouts/landinglayout'),
    DeploymentImportDefinitions = require('./components/resources/deploymentdefinition'),
    TestImportDefinitions = require('./components/resources/newTest'),
    DetailImportDefinitions = require('./components/resources/userDetailView'),
    Config = require('./config'),
    Login = require('./components/login'),
    App = require('./layouts/app'),
    React = require('react');
const {Route} = Router;

module.exports = (
    <Route path={Config.ROUTE_PREFIX} handler={App}>
        <Route handler={LandingLayout}>
            <Route name="login" handler={Login} />
        </Route>
        <Route handler={ConfiginatorLayout}>
            <Route name="/resources/deploymentdefinitions" handler={DeploymentImportDefinitions} />
        </Route>
        <Route handler={TestLayout}>
            <Route name="/resources/newtest" handler={TestImportDefinitions} />
        </Route>
        <Route handler={UserDetailLayout}>
            <Route name="/resources/userdetailview" handler={DetailImportDefinitions} />
        </Route>
    </Route>
);


