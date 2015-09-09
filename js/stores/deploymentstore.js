/**
 * Created by synerzip on 19/8/15.
 */

const ConfiginatorDispathcher = require('../configinatordispatcher'),
    ConfiginatorConstants = require('../constants/configinatorconstants'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    assign = require('object-assign'),
    CHANGE_EVENT = 'change',
    Cookies = require('cookies-js'),
    ActionTypes = ConfiginatorConstants.ActionTypes;


let _deploymentList = new Array();
let _ssoToken = null;
let _data = new Map();
let _granularData = new Map();
const DeploymentStore = assign({}, EventEmitter.prototype, {
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
    setResourceType(key, data){
        _data.set(key, data);
        this.emitChange();
    },
    getDeploymentList(){
        return _deploymentList;
    },
    setDeploymentList(rawJSON){
        //dataMap = new Array();
        //dataMap = _deploymentList.get(rawJson);
        //dataMap.set(rawJSON);
        _deploymentList = rawJSON.results.slice();
        this.emitChange();
    },
    refactorJSON(rawJSON){
        var length=rawJSON.results.length;
        var i=0;
        for(i=0;i<length;i++){
            var customerName=rawJSON.results[i].customer.name;
            var hostName=rawJSON.results[i].host.host_name;
            rawJSON.results[i].customer=customerName;
            rawJSON.results[i].host=hostName;
        }
        return rawJSON;
    },
    setGranular(type, key, rawJSON){
        rawJSON=this.refactorJSON(rawJSON);
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
    getToken(){
        return _ssoToken;
    },
    setToken(rawJSON){
        _ssoToken = rawJSON.sso_token;
        Cookies.set('ssoToken',rawJSON.sso_token);
        //Cookies.set('usertoken',token);
        //this.emitChange();
    }
});

DeploymentStore.dispatchToken = ConfiginatorDispathcher.register(function(action){
    const subjects = ['deployments'];
    if( action.method === 'get' &&
        action.type === ActionTypes.REQUEST_SUCCESS &&
        subjects.indexOf(action.subject) !== -1){
        if(action.params){
            const key = action.hash || action.params.id;
            DeploymentStore.setGranular(action.subject, key, action.rawJSON);
        }else{
            DeploymentStore.setResourceType(action.subject, action.rawJSON);
        }
    }
    else if(action.method === 'post' &&
        action.type === ActionTypes.REQUEST_SUCCESS ){
        DeploymentStore.setToken(action.rawJSON);
    }
});
module.exports = DeploymentStore;


