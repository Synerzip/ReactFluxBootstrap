const Dispatcher = require('flux').Dispatcher,
    assign = require('object-assign');


const ConfiginatorDispatcher = assign(new Dispatcher(), {});


module.exports = ConfiginatorDispatcher;
