const GenericTableDataAction = require('../../actions/genericTableDataAction'),
    _ = require('lodash');

module.exports = {
    storeSync: true,
    componentDidMount(){
        const lazyRequest = _.debounce((xhrDeps, isChained)=>{
            GenericTableDataAction.request(xhrDeps, isChained);
        }, 200);

        this.request = (xhrDeps, isChained)=>{
            lazyRequest(xhrDeps, isChained);
        };

        this.props.stores.forEach((store)=>{
            store.addChangeListener(this._onChange);
        });
        if(this.props.xhrDeps){
            if(this.customRequest){
                this.customRequest();
            }else{
                this.request(this.props.xhrDeps);
            }
        }
    },
    componentWillUnmount(){
        this.props.stores.forEach((store)=>{
            store.removeChangeListener(this._onChange);
        });
    },
    _onChange(){
        this.setState(this.getStateFromStores());
        if(this.afterOnChange){
            this.afterOnChange();
        }
    },
    getInitialState(){
        return this.getStateFromStores();
    }
};
