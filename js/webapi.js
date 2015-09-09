/* I'd like to create a resource_manager endpoint with a param for things like resources, resourceType, etc, will need some param and crudAction plumbing, waiting on merge with Daniel's changes
 */
const Rest = require('restwrapper'),
    Config = require('./config'),
    UserStore = require('./stores/userstore'),
    getHeaders = function () {//TODO move to helper
        const session = UserStore.get('session');
        const headers = {
            'accept': '*/*',
            'X-API-KEY': session['X-API-KEY']
            //'X-API-KEY': 'test123key'
        };
        return headers;
    },
    beforeSend = function(){
        this.headers = getHeaders();
        return true;
    },
    login = new Rest(Config.BASE_API + 'auth/token/generate/', {}, beforeSend),
    deployments = new Rest(Config.BASE_API + 'configinator/deployments/{?qs*}',{}, beforeSend),
    generateSSO = new Rest(Config.BASE_API + 'auth/generate-sso-token/',{}, beforeSend);

login.init = function(username, password, permissions) {
    this.headers = getHeaders();
    return this.post({username: username, password: password, token_type: 'user'});
},
    deployments.init = function(token){
        this.headers = {
            'accept': '*!/!*',
            'X-API-KEY': token
        }
        return this.get();
    };

generateSSO.init = function(){
    this.headers = getHeaders();
    return this.post({});
};

module.exports = {
    login: login,
    generateSSO :generateSSO,
    deployments :deployments
};

