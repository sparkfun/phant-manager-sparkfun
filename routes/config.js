var npmSearch = require('npm-package-search'),
  npm = require('npm'),
  fs = require('fs'),
  util = require('util'),
  async = require('async'),
  request = require('request'),
  path = require('path');

var search = npmSearch(
  path.join('/tmp/npm.json'), {
    interval: 3600 * 1000
  }
);

var defaults = {
  'phant-input-http': {
    name: 'phant-input-http',
    phantConfig: {
      name: 'HTTP',
      http: true,
      options: [
        {
          "label": "Metadata",
          "name": "metadata",
          "default": "phant-meta-nedb",
          "type": "select",
          "require": "meta",
          "description": "The phant metadata module to use"
        },
        {
          "label": "Keychain",
          "name": "keychain",
          "default": "phant-keychain-hex",
          "type": "select",
          "require": "keychain",
          "description": "The phant keychain module to use"
        }
      ]
    }
  },
  'phant-output-http': {
    name: 'phant-output-http',
    phantConfig: {
      name: 'HTTP',
      http: true,
      options: [
        {
          "label": "Storage",
          "name": "strorage",
          "default": "phant-stream-csv",
          "type": "select",
          "require": "stream",
          "description": "The phant stream storage module to use"
        },
        {
          "label": "Keychain",
          "name": "keychain",
          "default": "phant-keychain-hex",
          "type": "select",
          "require": "keychain",
          "description": "The phant keychain module to use"
        }
      ]
    }
  },
  'phant-manager-telnet': {
    name: 'phant-manager-telnet',
    phantConfig: {
      name: 'Telnet',
      options: [
        {
          "label": "Port",
          "name": "port",
          "default": "8081",
          "type": "number",
          "description": "The TCP port to listen on."
        },
        {
          "label": "Metadata",
          "name": "metadata",
          "default": "phant-meta-nedb",
          "type": "select",
          "require": "meta",
          "description": "The phant metadata module to use"
        },
        {
          "label": "Keychain",
          "name": "keychain",
          "default": "phant-keychain-hex",
          "type": "select",
          "require": "keychain",
          "description": "The phant keychain module to use"
        }
      ]
    }
  }
};

npm.load();

exports.make = function(req, res) {

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

    packages.forEach(function(p) {
      info[p.name] = get(p.name);
    });

    async.parallel(info, function(err, results) {

      res.render('config', {
        title: 'phant server configurator',
        err: err,
        packages: JSON.stringify(util._extend(defaults,results))
      });

    });

  });

};

exports.check = function(req, res) {

  request.get('https://registry.npmjs.org/phantconfig-' + req.param('name'), function(err, response, body) {
    res.json({exists: response.statusCode === 200});
  });

};

exports.createPackage = function(req, res) {

  res.render('config', {
    title: 'phant server configurator'
  });

};

exports.downloadPackage = function(req, res) {

  res.render('config', {
    title: 'phant server configurator'
  });

};
