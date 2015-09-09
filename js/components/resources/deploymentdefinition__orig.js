const React = require('react'),
    _ = require('lodash'),
    UserStore = require('../../stores/userstore'),
    DeploymentStore = require('../../stores/deploymentstore'),
    MenuNav = require('../navigation/navBar'),
    GenericTable = require('../../utils/generictable'),
    {Row,Col,Nav,NavItem,Grid,Glyphicon} =  require('react-bootstrap'),
    { ClickComponent, LinkComponent, LocalizedTime, ModalComponent, CronTabComponent } = require('../../utils/columns'),
    ConfiginatorActions = require('../../actions/configinatoractions'),
    Cookies = require('cookies-js')

const DeploymentList = React.createClass({
    propTypes: {},
    /*getInitialState: function() {
        console.log('Inside getInitialState 1');
        //return this.getStateFromStores();
    },*/
    makeHeader(){
        return (
            <Row>
                <Col md = {8}>
                    <h3>Environments</h3>
                </Col>
            </Row>
        );
    },

    getStateFromStores(){
        /*var data = [];
        data = DeploymentStore.getDeploymentList();*/
        //const results = (data[0]) ? data[0] : [];
        var data = {};
        const results = DeploymentStore.getDeploymentList();
        return {
            data: data,
            results: results
        };
    },
    componentDidMount: function() {
        DeploymentStore.addChangeListener(this._onChange)
    },
    getSSOtoken(rowData){
        ConfiginatorActions.generateSSO();
        const results = Cookies.get('ssoToken');
        const ssoToken = results;//.sso_token;
        var win = window.open(rowData.url + '/?sso_Token='+ results, '_blank');
        win.focus();
        //window.location.href = rowData.url + '/?sso_Token='+ results
        //this.context.router.transitionTo(Config.ROUTE_PREFIX + 'resources/detailedResourceReport/?sso_Token=' + ssoToken, {}, {});
    },
    render(){
        var gridStyle = {verticalAlign: 'top'};
        var divStyle={float:'left',marginLeft:'-29px', marginTop: '50px'};

       const griddleOptions = {
               columnMetadata: [{
                   order: 1,
                   columnName: 'host_name',
                   displayName: 'Customer'
               },{
                   order: 2,
                   columnName: 'environment_type',
                   displayName: 'Type'
               },{
                   order: 3,
                   columnName: 'installed_version',
                   displayName: 'Version'
               },{
                   order: 4,
                   columnName: 'url',
                   displayName: 'Actions',
                   customComponent: ClickComponent,
                   clickCallback: this.getSSOtoken
               }],
           columns: ['host_name', 'environment_type', 'installed_version', 'url']
        }
        const xhrDeps = {
            method: 'get',
            subject: 'deployments'
        }

        const header = this.makeHeader();

        return (
            <div>
                <Row style= {{marginBottom: '10'}}>
                    <Col md={3} style={{paddingLeft: '0'}}>
                        <MenuNav/>
                    </Col>
                    <Col md={8}>
                        {header}
                        <Col md={1}>

                        </Col>
                        <div style={divStyle}>
                           <Grid style={gridStyle}>
                               <Col md={10} className='show-grid'>
                                       <GenericTable griddleOptions = {griddleOptions}                                                     x
                                                     stores={[DeploymentStore]}
                                                     xhrDeps={xhrDeps}
                                                     getStateFromStores={this.getStateFromStores}/>
                               </Col>
                           </Grid>
                        </div>
                    </Col>
                </Row>
            </div>
            );

    },

    _onChange: function() {
        this.setState(this.getStateFromStores());
    }
});

module.exports = DeploymentList;
