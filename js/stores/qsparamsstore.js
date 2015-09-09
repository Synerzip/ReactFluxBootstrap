const BaseStore = require('./basestore'),
    ConfiginatorConstants = require('../constants/configinatorconstants'),
      ActionTypes = ConfiginatorConstants.ActionTypes,
    ConfiginatorDispatcher = require('../configinatordispatcher'),
      assign = require('object-assign'),
      _ = require('lodash');

const QSParamsStore = assign({}, BaseStore, {
  merge (params) {
      const qs = _.extend({}, this._data.get('params') || {}, params);
      this._data.set('params', qs);
      this.emitChange();
  },
  clear () {
      this._data.clear();
  }
});

QSParamsStore.dispatchToken = ConfiginatorDispatcher.register(function(action){
  if (action.type === ActionTypes.QUERY_PARAMS_MERGE) {
      QSParamsStore.merge(action.params || {});
  } else if (action.type === ActionTypes.QUERY_PARAMS_CLEAR) {
      QSParamsStore.clear();
  }
});

module.exports = QSParamsStore;
