/* jshint esnext: true */
const ConfiginatorDispatcher = require('../configinatordispatcher'),
    ConfiginatorConstants = require('../constants/configinatorconstants'),
    WebAPI = require('../webapi'),
    Config = require('../config'),
    Cookies = require('cookies-js'),
    ActionTypes = ConfiginatorConstants.ActionTypes;

module.exports = {
    login(username, password, formID){
        ConfiginatorDispatcher.dispatch({
            type: ActionTypes.REQUEST_SENT
        });
        const userPermissions = ConfiginatorConstants.RequiredPermissions;
        WebAPI['login'].init(username, password, userPermissions)
            .then(function(data){
                //refeactor to only have one dispatch
                ConfiginatorDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_USER_SESSION_DATA,
                    rawJSON: data.body,
                    formID: formID
                });
                ConfiginatorDispatcher.dispatch({
                    type: ActionTypes.REQUEST_SUCCESS,
                    formId: formID
                });
            })
            .catch(function(error){
                ConfiginatorDispatcher.dispatch({
                    type: ActionTypes.REQUEST_FAILED,
                    rawJSON: error,
                    formID: formID
                });
            });
    },
     generateSSO(){
     ConfiginatorDispatcher.dispatch({
     type: ActionTypes.REQUEST_SENT
     });
     WebAPI.generateSSO.init()
     .then(function (data) {
     ConfiginatorDispatcher.dispatch({
     method: 'post',
     subject: 'generate-sso-token',
     type: ActionTypes.REQUEST_SUCCESS,
     rawJSON: data.body
     });
     })
     .catch(function (error) {
     ConfiginatorDispatcher.dispatch({
     type: ActionTypes.REQUEST_FAILED,
     rawJSON: error,
     formID: formID
     });
     });

     },

    logout(){
        //delete any session cookies
        Cookies.expire('sessionid');
        Cookies.expire('grantedPermissions');
        //window.location = Config.BASE_URL + 'login';
    },
    showLoadingOverlay(spinnerHash){
        ConfiginatorDispatcher.dispatch({
            type: ActionTypes.SHOW_LOADING_OVERLAY,
            spinnerHash: spinnerHash
        });
    },
    hideLoadingOverlay(spinnerHash){
        ConfiginatorDispatcher.dispatch({
            type: ActionTypes.HIDE_LOADING_OVERLAY,
            spinnerHash: spinnerHash
        });
    },
    toggleSideNav(ensureExpanded){
        ConfiginatorDispatcher.dispatch({
            type: ActionTypes.TOGGLE_SIDE_NAV,
            ensureExpanded: ensureExpanded
        });
    },
    closeSideNav(){
        ConfiginatorDispatcher.dispatch({
            type: ActionTypes.CLOSE_SIDE_NAV
        });
    },
    text() {
        WebAPI.text.get().then(function (data) {
            ConfiginatorDispatcher.dispatch({
                type: ActionTypes.REQUEST_TEXT,
                data: data
            });
        });
    },
    mergeQSParams(params) {
        setTimeout(function () {
            ConfiginatorDispatcher.dispatch({
                type: ActionTypes.QUERY_PARAMS_MERGE,
                params: params
            });
        }, 0);
    },
    clearQSParams() {
        ConfiginatorDispatcher.dispatch({
            type: ActionTypes.QUERY_PARAMS_CLEAR
        });
    }

};
