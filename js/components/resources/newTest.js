const React = require('react'),
    MenuNav = require('../navigation/navBar'),
     {Row,Col} =  require('react-bootstrap')

const TestComponent = React.createClass({
    makeHeader(){
        return (
            <Row>
                <Col md = {8}>
                    <h3>Test</h3>
                </Col>
            </Row>
        );
    },
    render(){
        var header=this.makeHeader();
        return (
            <div>
                <Row style= {{marginBottom: '10'}}>
                    <Col md={3} style={{paddingLeft: '16'}}>
                        <MenuNav/>
                    </Col>
                </Row>
            </div>
        );

    }
});

module.exports = TestComponent;
