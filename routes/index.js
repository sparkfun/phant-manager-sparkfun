var npmSearch = require('npm-package-search'),
    path = require('path');

var search = npmSearch(
  path.join('/tmp/npm.json'),
  { interval: 600 * 1000 } // 10 mins
);

exports.home = function(req, res) {
  res.render('home');
};

exports.config = function(req, res) {

  search(/^phant-/, function(err, packages) {

    var response = {
      title: 'phant server configurator',
      input: [],
      manager: [],
      stream: [],
      output: []
    };

    packages.forEach(function(p) {

      if(/^phant-input/.test(p.name)) {
        response.input.push(p);
      }

      if(/^phant-output/.test(p.name)) {
        response.output.push(p);
      }

      if(/^phant-stream/.test(p.name)) {
        response.output.push(p);
        response.stream.push(p);
      }

      if(/^phant-manager/.test(p.name)) {
        response.manager.push(p);
      }

    });

    res.render('config', response);

  });

};
