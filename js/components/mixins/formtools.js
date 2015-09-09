/* jshint esnext: true */
const React = require('react'),
  {Alert} = require('react-bootstrap'),
  ErrorStore = require('../../stores/errorstore'),
  defaultConstraints = require('../../constraints'),
  _ = require('lodash'),
  validate = require('validate.js');

const FormMixins = {
  /**
   * Serialize form using form tools mixin
   * Validate form using form tools mixin
   * return object with formdata and validated flag
   */
  parseAndValidate(){//boilerplate to move to mixin
    const formData = this.serializeForm(),
    validated = this.validate(formData, this.state.constraints);
    return {
      formGlobalError: false,
      formData: formData,
      validated: validated
    };
  },
  getInitialState(){
    if(!Array.isArray(this.constraints)){
      this.constraints = [];
    }
    return {
      errors: {},
      constraints: this.constraints.reduce((constraints, constraint) => {
        constraints[constraint] = defaultConstraints[constraint];
        return constraints;
      }, {})
    };
  },
  renderFormGlobalError(){
    let alertMessage = '';
    if(this.state.formGlobalError){
      alertMessage = <Alert bsStyle={this.state.formGlobalError.style}>{this.state.formGlobalError.message}</Alert>;
    }
    /* jshint ignore:end */
    return (this.state.formGlobalError) ? alertMessage : '';
  },
  /**
   * formID will be used as a way to map this form instance to an error store
   */
  componentDidMount(){
    this.formID = _.uniqueId();
    ErrorStore.addChangeListener(this.syncErrors);
  },
  /**
   * For now, we are just going to handle an error with a default message, need to work with BE to return matching refs to give
   * field target messages from BE
   * We also should have the consuming form give a standard top level message
  */
  syncErrors(){
    let formGlobalError, message;
    if (this.getMessagesFromStore()){
     message = this.getMessagesFromStore();
     if (message.indicator === 'error' && this.props.formGlobalErrorMessage){
      formGlobalError = {style: 'danger', message: this.props.formGlobalErrorMessage};
     }
     else if(message.indicator === 'success' && this.props.formGlobalSuccessMessage){
       formGlobalError = {style: 'success', message: this.props.formGlobalSuccessMessage};
     }else{
      formGlobalError = '';
     }
    }else{
      formGlobalError = '';
    }
    this.setState({
        'formGlobalError': formGlobalError,
        'formMessageIndicator': message && message.indicator || null
    });//Temp code, see note above
  },
  getMessagesFromStore(){
    return ErrorStore.get(this.formID);
  },
  componentWillUnmount(){
    //TODO ADD action to delete instance ID
    ErrorStore.removeChangeListener(this.syncErrors);
  },
  serializeForm(){
    let formData = {};
    Object.keys(this.refs).forEach((ref)=>{
      if (_.isFunction(this.refs[ref].getValue)){//need to include some sort of check for submit button, also handle select,radio elems
        formData[ref] = this.refs[ref].getValue();
      }
    });
    return formData;
  },
  validate(formData, constraints){
    const validateResults = validate(formData, constraints);
    this.setState({
      errors: (validateResults) ? validateResults : {}//ensure state.errors always has at least an empty object
     });
    return !validateResults;//return boolean true false if errors are present.
  }
};


const ValidateFields = React.createClass({
  propTypes: {
    errors: React.PropTypes.object.isRequired,
    onKeyUp: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    children: React.PropTypes.any
  },
  getDefaultProps(){
    return {
      onKeyUp: function(){},
      onBlur: function(){}
    };
  },
  render() {
    let safePropsChildren = (this.props.children instanceof Array) ? this.props.children : [this.props.children];//need to ensure we have an array to iterate over
    let inputFields = safePropsChildren.map(function(field){
      if(this.props.errors[field.ref] && this.props.errors[field.ref][0]){
        field.props.bsStyle = 'error';
        field.props.hasFeedback = true;
        field.props.label = '(' + this.props.errors[field.ref][0] + ')';
        field.props.onKeyUp = this.props.onKeyUp;
        field.props.onBlur = this.props.onBlur;
      }
      return field;
    }.bind(this));
    /* jshint ignore:start */
    return (
      <div>
        {inputFields}
      </div>
    );
    /* jshint ignore:end */
  }

});

module.exports = {
  ValidateFields: ValidateFields,
  FormMixins: FormMixins
};
