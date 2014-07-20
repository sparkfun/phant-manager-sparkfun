var npmSearch = require('npm-package-search'),
  npm = require('npm'),
  fs = require('fs'),
  path = require('path');

var search = npmSearch(
  path.join('/tmp/npm.json'), {
    interval: 600 * 1000
  } // 10 mins
);

npm.load();

exports.home = function(req, res) {
  res.render('home');
};

exports.config = function(req, res) {

  search(/^phant-/, function(err, packages) {

    var response = {
      title: 'phant server configurator',
      input: [],
      manager: [],
      meta: [],
      stream: [],
      output: []
    };

    packages.forEach(function(p) {

      if (/^phant-input/.test(p.name)) {
        response.input.push(p);
      }

      if (/^phant-output/.test(p.name)) {
        response.output.push(p);
      }

      if (/^phant-stream/.test(p.name)) {
        response.output.push(p);
        response.stream.push(p);
      }

      if (/^phant-meta/.test(p.name)) {
        response.meta.push(p);
      }

      if (/^phant-manager/.test(p.name)) {
        response.manager.push(p);
      }

    });

    res.render('config', response);

  });

};

exports.createPackage = function(req, res) {

  npm.commands.view([req.param('output')], console.log);

  res.render('config', {
      title: 'phant server configurator',
      input: [],
      manager: [],
      meta: [],
      stream: [],
      output: []
    });

};
