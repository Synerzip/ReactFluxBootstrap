const React = require('react'),
  ConfiginatorActions = require('../actions/configinatoractions'),
  { FloatingInput } = require('./mycompanycommon.js'),
  {Grid, Col, Row, Panel, Button} = require('react-bootstrap'),
  {FormMixins, ValidateFields} = require('./mixins/formtools');

const Login = React.createClass({
  propTypes(){
    return {
    };
  },
  constraints: ['username', 'password'],
  getDefaultProps(){
    return {
      formGlobalErrorMessage: 'Your username/password combination is incorrect'
    };
  },
  mixins: [FormMixins],
  /**
   * Event Handler, validates form, if no errors fire action to login
   */
  onSubmit(e){
    e.preventDefault();
    this.parseAndValidate();
    const {formData, validated} = this.parseAndValidate();
    if(validated){
      ConfiginatorActions.login(formData.username, formData.password, this.formID);
    }
  },
  /**
   * ValidateFields takes onKeyUp callback to revalidate aggressively once an error occurs
   */
  render() {
    const formGlobalError = this.renderFormGlobalError();
    return (
      <Grid>
        <Row className="login">
          <Col xs={10} md={6} className="center-block">
            <Panel>
              <h3>Welcome to the MyComapny </h3>
              <h5>Please sign in to get access</h5>
              {formGlobalError}
              <form>
                <ValidateFields errors={this.state.errors} onKeyUp={this.parseAndValidate}>
                  <FloatingInput id="username" type="text" ref="username" placeholder="Username" />
                  <FloatingInput id="password" type="password" ref="password" placeholder="Password" />
                </ValidateFields>
                <Button type="submit" bsStyle="primary" ref="submit" onClick ={this.onSubmit}>Login</Button>
              </form>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }

});

module.exports = Login;

