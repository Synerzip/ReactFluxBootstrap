const Router = require('react-router'),
    UserNavBar = require('../components/navigation/usernavbar'),
    UserStore = require('../stores/userstore'),
    StoreSync = require('../components/mixins/storesync'),
    { Grid, Row, Col } = require('react-bootstrap'),
    React = require('react'),
    Spinner = require('react-spinkit');

const { RouteHandler } = Router;

const ConfiginatorLayout = React.createClass({
    propTypes(){
        return {
            stores: React.PropTypes.array
        };
    },
    getDefaultProps(){
        return {
            stores: [
                UserStore
            ]
        };
    },
    getStateFromStores(){
        return {
            loadingOverlay: UserStore.shouldShowLoadingOverlay()
        };
    },
    mixins: [StoreSync],
    toggleLoadingOverlay () {
        if (this.state.loadingOverlay) {
            return (
                <div className="application-loading-overlay">
                    <Spinner noFadeIn spinnerName='double-bounce' />
                </div>
            );
        }
        return null;
    },
    render() {
        const loadingOverlay = this.toggleLoadingOverlay();
        return (
            <div>
                {loadingOverlay}
                <UserNavBar {...this.props} />
                <Grid fluid style = {{marginBottom: '60'}}>
                    <Row>
                        <Col xs={12} md={10}>
                            <RouteHandler />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

});

module.exports = ConfiginatorLayout;
