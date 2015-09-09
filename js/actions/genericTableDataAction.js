const ConfiginatorDispatcher = require('../configinatordispatcher'),
    ConfiginatorConstants = require('../constants/configinatorconstants'),
    ConfiginatorActions = require('./configinatoractions'),
    _ = require('lodash'),
    WebAPI = require('../webapi'),
    preventLoadingOverlaySubjects = ['changePassword'];


const ActionTypes = ConfiginatorConstants.ActionTypes,
    _request = function(options){
        const defaultOptions = {
            method: 'get',
            subject: '',
            params: {},
            payload: {},
            formID: null,
            hash: null,
            spinnerHash: _.uniqueId()
        };
        const {subject, method, params, payload, formID, hash, spinnerHash} = _.extend({}, defaultOptions, options, hash);
        if(WebAPI[subject] && WebAPI[subject][method]){
            if (_.indexOf(preventLoadingOverlaySubjects, subject) === -1) {
                setTimeout(function () {
                    ConfiginatorActions.showLoadingOverlay(spinnerHash);
                }, 5);
            }
            WebAPI[subject][method](params, payload)
                .then(function(data){
                    ConfiginatorActions.hideLoadingOverlay(spinnerHash);
                    ConfiginatorDispatcher.dispatch({
                        type: ActionTypes.REQUEST_SUCCESS,
                        subject: subject,
                        formID: formID,
                        rawJSON: data.body,
                        params: params,
                        method: method,
                        hash: hash
                    });
                    if (options.onSuccess){
                        options.onSuccess();
                    }
                })
                .catch(function(error){
                    ConfiginatorActions.hideLoadingOverlay(spinnerHash);
                    ConfiginatorDispatcher.dispatch({
                        type: ActionTypes.REQUEST_FAILED,
                        rawJSON: error,
                        formID: formID
                    });
                    if(options.onError){
                        options.onError();
                    }
                });
        }
    };

module.exports = {
    request(options){
        if(!Array.isArray(options)){
            _request(options);
        }else{
            options.forEach((option)=>{
                _request(option);
            });
        }
    },
    toggleSideNav(ensureExpanded){
        ConfiginatorDispatcher.dispatch({
            type: ActionTypes.TOGGLE_SIDE_NAV,
            ensureExpanded: ensureExpanded
        });
    },
};
