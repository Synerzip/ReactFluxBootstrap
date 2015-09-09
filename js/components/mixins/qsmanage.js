const _ = require('lodash'),
      QSParamsStore = require('../../stores/qsparamsstore'),
    ConfiginatorActions = require('../../actions/configinatoractions');

module.exports = {
    mergeQueryParams(params){
        ConfiginatorActions.mergeQSParams(params);
    },
    componentDidMount(){
        QSParamsStore.addChangeListener(this._onParamsChange);
    },
    componentWillUnmount(){
        QSParamsStore.removeChangeListener(this._onParamsChange);
    },
    _onParamsChange(){
        const params = QSParamsStore.get('params');
        this.context.router.replaceWith(this.context.router.getCurrentPathname(), {}, params);
    }
};
