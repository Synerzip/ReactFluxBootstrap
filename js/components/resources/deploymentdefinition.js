const React = require('react'),
    _ = require('lodash'),
    UserStore = require('../../stores/userstore'),
    DeploymentStore = require('../../stores/deploymentstore'),
    ConfiginatorConstants = require('../../constants/configinatorconstants'),
    MenuNav = require('../navigation/navBar'),
    GenericTable = require('../../utils/generictable'),
    {Row,Col,Nav,NavItem,Grid,Glyphicon} =  require('react-bootstrap'),
    { ClickComponent, LinkComponent, LocalizedTime, ModalComponent, CronTabComponent } = require('../../utils/columns'),
    //ConfiginatorActions = require('../../actions/configinatoractions'),
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

    getStateFromStores(hash){
        const data = DeploymentStore.getGranular('deployments', hash);
        const results = (data && data.results) ? data.results : [];
        return {
            data: data,
            results: results
        };
    },
    componentDidMount: function() {
        DeploymentStore.addChangeListener(this._onChange)
    },
    getSSOtoken(rowData){
        //ConfiginatorActions.generateSSO();
        const results = Cookies.get('ssoToken');
        const ssoToken = results;//.sso_token;
        var win = window.open(rowData.url + '?sso_Token='+ ssoToken, '_blank');
        win.focus();3
        //window.location.href = rowData.url + '/?sso_Token='+ results
        //this.context.router.transitionTo(Config.ROUTE_PREFIX + 'resources/detailedResourceReport/?sso_Token=' + ssoToken, {}, {});
    },
    render(){
        var gridStyle = {verticalAlign: 'top'};
        var divStyle={float:'left',marginLeft:'-29px', marginTop: '50px'};

        const griddleOptions = {
            columnMetadata: [{
                order: 1,
                columnName: 'host',
                displayName: 'Host Name'
            },{
                order: 2,
                columnName: 'customer',
                displayName: 'Customer'
            },{
                order: 3,
                columnName: 'environment_type',
                displayName: 'Type'
            },{
                order: 4,
                columnName: 'installed_version',
                displayName: 'Version'
            },{
                order: 5,
                columnName: 'url',
                displayName: 'Actions',
                customComponent: ClickComponent,
                clickCallback: this.getSSOtoken
            }],
            filterableColumns: [{
                displayName: 'Host Name',
                parameter: 'host_name',
                type: 'text'
            },{
                displayName: 'Customer',
                parameter: 'customer__name',
                type: 'text'
            }, {
                displayName: 'Type',
                parameter: 'environment_type',
                type: 'multiList',
                data: ConfiginatorConstants.lists.environmentType
            }, {
                displayName: 'Version',
                parameter: 'installed_version',
                type: 'text'
            }, {
                displayName: 'Actions',
                parameter: 'url',
                type: 'text'
            }],
            columns: ['host','customer', 'environment_type', 'installed_version', 'url']

        }
        const xhrDeps = {
            method: 'get',
            subject: 'deployments'
        }

        const header = this.makeHeader();
        const defaultSort = {
            sortColumn: 'environment_type',
            sortDirection: 'desc'
        };

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
                                    <GenericTable griddleOptions = {griddleOptions}
                                                  defaultSort = {defaultSort}
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
