var npmSearch = require('npm-package-search'),
  npm = require('npm'),
  fs = require('fs'),
  async = require('async'),
  request = require('request'),
  path = require('path');

var search = npmSearch(
  path.join('/tmp/npm.json'), {
    interval: 600 * 1000
  }
);

npm.load();

exports.home = function(req, res) {
  res.render('home');
};

exports.config = function(req, res) {

  var get = function(name) {

    return function(cb) {

      request.get('https://registry.npmjs.org/' + name + '/latest', function(err, response, body) {

        if (err) {
          return cb(err);
        }

        cb(null, JSON.parse(body));

      });

    };

  };

  search(/^phant-/, function(err, packages) {

    var info = {};

    if(err) {
      console.log(err);
    }

    packages.forEach(function(p) {
      info[p.name] = get(p.name);
    });

    async.parallel(info, function(err, results) {

      res.render('config', {
        title: 'phant server configurator',
        err: err,
        packages: JSON.stringify(results)
      });

    });

  });

};

exports.createPackage = function(req, res) {

  res.render('config', {
    title: 'phant server configurator'
  });

};
