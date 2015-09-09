require('babel/polyfill');//needed for Maps,Sets,Promises in < IE 11 and phantomJS, remove when we support IE11 and phantomJS 2
const React = require('react'),
    domReady = require('domready'),
    Router = require('react-router'),
    Routes = require('./configinatorroutes');

domReady(function(){
  Router.run(Routes, Router.HistoryLocation, function (Handler, state){
    React.render(<Handler path={state.path}/>, document.body);
  });
});
