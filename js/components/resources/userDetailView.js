const React = require('react'),
    MenuNav = require('../navigation/navBar'),
    _ = require('lodash'),
    UserDetailStore = require('../../stores/userDetailStore'),
    ConfiginatorConstants = require('../../constants/configinatorconstants'),
    NewGenericTable = require('../../utils/newGenerictable'),
    {Row,Col,Nav,NavItem,Grid,Glyphicon,Panel,PanelGroup,PageHeader,Table,Button} =  require('react-bootstrap'),
    { ClickComponent, LinkComponent, LocalizedTime, ModalComponent, CronTabComponent } = require('../../utils/columns'),
    //ConfiginatorActions = require('../../actions/configinatoractions'),
    Cookies = require('cookies-js')


const DetailViewComponent = React.createClass({
    getInitialState() {
        return {
            open: false
        };
    },
    makeHeader(){
        return (

                <PageHeader >Environments <small> "Test" Details</small></PageHeader>

        );
    },

    render(){
        const griddleOptions = {
            columnMetadata: [{
                order: 1,
                columnName: 'User Name',
                displayName: 'User Name'
            },{
                order: 2,
                columnName: 'Permission',
                displayName: 'Permission'
            },{
                order: 3,
                columnName: 'Edit',
                displayName: 'Edit'
            },{
                order: 4,
                columnName: 'installed_version',
                displayName: 'Version'
            }],
            columns: ["User Name", "Permission", "Edit", "Delete"]
        };
        var header=this.makeHeader();
        var gridStyle = {verticalAlign: 'top'};
        var divStyle={float:'left',marginLeft:'-29px', marginTop: '50px'};
        return (
            <div>
                <Row style= {{marginBottom: '10'}}>
                    <Col md={3} style={{paddingLeft: '16',width:'21.5%'}}>
                        <MenuNav/>
                    </Col>
                    <Col md={8}>
                        {header}
                        <Col md={1}>

                        </Col>
                        <div style={divStyle}>
                            <Grid style={gridStyle}>
                                <Col md={10}>
                                    <NewGenericTable griddleOptions = {griddleOptions} />
                                </Col>
                            </Grid>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
});

module.exports = DetailViewComponent;
