const React = require('react'),
      _ = require('lodash'),
      { Input } = require('react-bootstrap');

const FloatingInput = React.createClass({
  propTypes: {
    placeholder: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    label: React.PropTypes.string //please do not explicitly pass this in
  },
  getInitialState(){
    return {
      floatLabel: false
    };
  },
  getInputDOMNode(){
    return this.refs.input.getInputDOMNode();
  },
  getValue(){
    return this.refs.input.getValue();
  },
  componentDidMount(){
    if(this.getValue()){
      this.setState({floatLabel: true});
    }
  },
  onFocus(){
    this.setState({floatLabel: true});
    if(this.props.onFocus){
      this.props.onFocus();
    }
  },
  onBlur(e){
    if(e.currentTarget.value.length === 0){
      this.setState({floatLabel: false});
    }
    if(this.props.onBlur){
      this.props.onBlur();
    }
  },
  render() {
   const {label, placeholder} = this.state.floatLabel ?
     { label: this.props.placeholder, placeholder: ''} :
     { label: ' ', placeholder: this.props.placeholder};

    const customProps = {
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      ref: 'input',
      label: this.props.label || label, //need to defer to props label for form validation error message, relying on implementor not to explicitly pass label
      placeholder: placeholder
    };
    const floatingInputProps = _.extend({}, this.props, customProps);
    return (
      <Input {...floatingInputProps} />
    );
  }

});

module.exports = {
  FloatingInput: FloatingInput
};
