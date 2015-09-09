const ConfiginatorDispatcher = require('../configinatordispatcher'),
  ConfiginatorConstants = require('../constants/configinatorconstants'),
  EventEmitter = require('events').EventEmitter,
  Cookies = require('cookies-js'),
  assign = require('object-assign'),
  CHANGE_EVENT = 'change',
  ActionTypes = ConfiginatorConstants.ActionTypes ;

let _data = new Map();

_data.set('user', {
  name: 'Lyle',
  company: 'Step One'
});

_data.set('session', {});

_data.set('fullSideNav', true);

let _spinnerHashes = new Set();//hashes that represent current connections
let _grantedPermissions = new Set();
let _deploymentList = new Array();


const UserStore = assign({}, EventEmitter.prototype, {
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
  toggleSideNav(ensureExpanded){
    const fullSideNav = _data.get('fullSideNav');
    if((ensureExpanded && !fullSideNav) || !ensureExpanded){
        _data.set('fullSideNav', !fullSideNav);
        this.emitChange();
    }
  },
  setProfile(data) {
      _data.set('profile', data);
      this.emitChange();
  },
  closeSideNav() {
      if (_data.get('fullSideNav')) {
          this.toggleSideNav(false);
      }
  },
  shouldShowLoadingOverlay(){
   return (_spinnerHashes.size > 0);
  },
  addSpinnerHash(spinnerHash) {
    _spinnerHashes.add(spinnerHash);
     this.emitChange();
  },
  removeSpinnerHash(spinnerHash) {
    _spinnerHashes.delete(spinnerHash);
    this.emitChange();
  },
  setSessionData(sessionData){
    let session = _data.get('session'),
      token = sessionData.token;
      if(token !== session['X-API-KEY']){
        session.loggedIn = true;
        session['X-API-KEY'] = token;
         Cookies.set('sessionid', token);
        _data.set('session', session);
        if(sessionData.granted_permissions && Array.isArray(sessionData.granted_permissions)){
          sessionData.granted_permissions.forEach((permissionIndex)=>{
            if(ConfiginatorConstants.RequiredPermissions[permissionIndex]){
              _grantedPermissions.add(ConfiginatorConstants.RequiredPermissions[permissionIndex]);
            }
          });
          Cookies.set('grantedPermissions', sessionData.granted_permissions.join(','));
        }
        setTimeout(()=>{
          this.emitChange();
        }, 10);
          this.emitChange();
      }
  },
  getAllGrantedPermissions(){
    return Array.from(_grantedPermissions);
  },
  hasGrantedPermission(permission){
    return _grantedPermissions.has(permission);
  },
  getDeploymentList(){
      return _deploymentList;
  },
  setDeploymentList(response){
     _deploymentList = response.results.slice();
      this.emitChange();
  }
});


let bootstrap = {
  'X-API-KEY': document.querySelector('meta[name=api-key]').content
};
_data.set('session', bootstrap);//refactor
if(Cookies.get('sessionid')){
  const granted_permissions = (Cookies.get('grantedPermissions')) ? Cookies.get('grantedPermissions').split(',') : [];
  const sessionData = {
    granted_permissions: granted_permissions,
    token: Cookies.get('sessionid'),
  };
  UserStore.setSessionData(sessionData);
}

UserStore.dispatchToken = ConfiginatorDispatcher.register(function(action){
  switch(action.type){
    case ActionTypes.RECEIVE_USER_SESSION_DATA:
        UserStore.setSessionData(action.rawJSON);
        break;
    case ActionTypes.RECEIVE_USER_DEPLOYMENTS:
        UserStore.setDeploymentList(action.rawJSON);
        break;
    case ActionTypes.TOGGLE_SIDE_NAV:
        let ensureExpanded = action.ensureExpanded;
        UserStore.toggleSideNav(ensureExpanded);
        break;
    case ActionTypes.CLOSE_SIDE_NAV:
        UserStore.closeSideNav();
        break;
    case ActionTypes.SHOW_LOADING_OVERLAY:
        UserStore.addSpinnerHash(action.spinnerHash);
        break;
    case ActionTypes.HIDE_LOADING_OVERLAY:
        UserStore.removeSpinnerHash(action.spinnerHash);
        break;
    case ActionTypes.REQUEST_SUCCESS:
        if (action.subject === 'userProfile') {
            UserStore.setProfile(action.rawJSON);
        }
        break;
   }

});
module.exports = UserStore;
