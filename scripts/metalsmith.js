var metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');

var metalsmith = metalsmith(__dirname)
  .source('../pages')
  .destination('../dist')
  .use(permalinks({
    pattern: ':title'
  }))
  .use(templates({
    engine: 'swig',
    directory: '../templates'
  }))
  .build(function(err){
    if (err) throw err;
  });
