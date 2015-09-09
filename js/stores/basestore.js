/* jshint esnext: true */
const EventEmitter = require('events').EventEmitter,
      assign = require('object-assign'),
      CHANGE_EVENT = 'change',
      _data = new Map(),
      _granularData = new Map();

const BaseStore = assign({}, EventEmitter.prototype, {
  _data: _data,
  _granularData: _granularData,
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
    return this._data.get(type);
  },
  setGranular(type, key, rawJSON){
    const dataMap = this._granularData.get(type) || new Map();
    dataMap.set(key, rawJSON);
    this._granularData.set(type, dataMap);
    this.emitChange();
  },
  getGranular(type, id){
    if(this._granularData.get(type)){
      return this._granularData.get(type).get(id);
    }else{
      return false;
    }
  }
});

module.exports = BaseStore;
