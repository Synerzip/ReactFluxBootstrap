/* jshint esnext: true */
const ConfiginatorDispathcher = require('../configinatordispatcher'),
  ConfiginatorConstants = require('../constants/configinatorconstants'),
  EventEmitter = require('events').EventEmitter,
   _ = require('lodash'),
  assign = require('object-assign'),
  CHANGE_EVENT = 'change',
  ActionTypes = ConfiginatorConstants.ActionTypes;


let _data = new Map();
let _granularData = new Map();
const ResourceStore = assign({}, EventEmitter.prototype, {
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
    return _data.get(type);
  },
  getProviders(hash){
    const resourceTypes = (this.getGranular('resourceTypes', hash)) ? this.getGranular('resourceTypes', hash).results : [];
    const allProviders = _.reduce(resourceTypes, (providers, resourceType)=>{
      const p = resourceType.provider.map((provider)=>{
        return {
          Provider: provider.display_name,
          id: provider.id
        };
      });
      return providers.concat(p);
    }, []);
    return allProviders;
  },
  setResourceType(key, data){
    _data.set(key, data);
     this.emitChange();
  },
  setGranular(type, key, rawJSON){
    const dataMap = _granularData.get(type) || new Map();
    dataMap.set(key, rawJSON);
    _granularData.set(type, dataMap);
    this.emitChange();
  },
  getGranular(type, id){
    if(_granularData.get(type)){
      return _granularData.get(type).get(id);
    }else{
      return false;
    }
  },
  setResourceImporterDefinition(params, rawJSON){
    const importerDefinitions = _data.get('importerDefinitionsGranular') || new Map();
    importerDefinitions.set(params.id, rawJSON);
    _data.set('importerDefinitionsGranular', importerDefinitions);
     this.emitChange();
  },
  getResourceImporterDefinition(id){//I'd like to generalize indivual elements vs collection with some sort of json model/collection concept vs rawJSON everywhere
    if(_data.get('importerDefinitionsGranular')){
      return _data.get('importerDefinitionsGranular').get(id);
    }else{
      return false;
    }
  }
});

ResourceStore.dispatchToken = ConfiginatorDispathcher.register(function(action){
  const subjects = ['contextProfileAssignableResources', 'resourceImporterDefinitions', 'resourceTypes', 'resourceimporterjobretrievers', 'resources', 'resourceImporterJobs', 'resourceActivities', 'contextProfiles', 'contextProfileResources', 'resourceImporterJobs', 'resourceImporterDefinitions'];
  if(action.method === 'get' && action.type === ActionTypes.REQUEST_SUCCESS && subjects.indexOf(action.subject) !== -1){
      if(action.params){
        const key = action.hash || action.params.id;
        ResourceStore.setGranular(action.subject, key, action.rawJSON);
      }else{
        ResourceStore.setResourceType(action.subject, action.rawJSON);
      }
   }
});
module.exports = ResourceStore;
