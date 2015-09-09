//TODO rename to more general formMessageStore
const ConfiginatorDispatcher = require('../configinatordispatcher'),
  configinatorConstants = require('../constants/configinatorconstants'),
  EventEmitter = require('events').EventEmitter,
  assign = require('object-assign'),
  CHANGE_EVENT = 'change',
  ActionTypes = configinatorConstants.ActionTypes,
  _errors = new Map(),
  _successes = new Map();

const ErrorStore = assign({}, EventEmitter.prototype, {
  emitChange(){
    this.emit(CHANGE_EVENT);
  },
  addChangeListener(callback){
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },
  get(type){
    let response = false;
    if(_errors.get(type)){
      response = {
        indicator: 'error',
        payload: _errors.get(type)
     };
    }else if(_successes.get(type)){
      response = {
       indicator: 'success',
       payload: _successes.get(type)
      };
    }
    return response;
  },
  /**
   * adds a success for the corresponding formID, removes it after X ms
   * deletes any errors corresponding to this formID
   */
  addSuccess(payload){
    _errors.delete(payload.formID);
    const response = payload.rawJSON ? payload.rawJSON : {success: true};
    _successes.set(payload.formID, response);
    this.emitChange();

    setTimeout(()=>{
      _successes.delete(payload.formID);
      this.emitChange();
    }, 3000);
  },
  setFormErrors(success, payload){//make success flag more semantic
    if(payload.formID){
      if(success){
        this.addSuccess(payload);
      }else{
        _errors.set(payload.formID, payload.rawJSON);
        this.emitChange();
      }
    }
  }
});

ErrorStore.dispatchToken = ConfiginatorDispatcher.register(function(action){
  switch(action.type){
    case ActionTypes.REQUEST_FAILED:
      ErrorStore.setFormErrors(false, action);
    break;
    case ActionTypes.REQUEST_SUCCESS:
      ErrorStore.setFormErrors(true, action);
    break;
   }

});
module.exports = ErrorStore;
