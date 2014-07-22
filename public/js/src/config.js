(function($) {

  var templates = {},
      config = {};

  var defaults = {
    input: {
      name: 'phant-input-http',
      phantConfig: {
        name: 'HTTP',
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
          },
          {
            "label": "Validator",
            "name": "validator",
            "default": "phant-validator-default",
            "type": "select",
            "require": "validator",
            "description": "The phant validator module to use"
          }
        ]
      }
    },
    output: {
      name: 'phant-output-http',
      phantConfig: {
        name: 'HTTP',
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
          },
          {
            "label": "Validator",
            "name": "validator",
            "default": "phant-validator-default",
            "type": "select",
            "require": "validator",
            "description": "The phant validator module to use"
          }
        ]
      }
    },
    manager: {
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
          },
          {
            "label": "Validator",
            "name": "validator",
            "default": "phant-validator-default",
            "type": "select",
            "require": "validator",
            "description": "The phant validator module to use"
          }
        ]
      }
    }
  };

  config.loadTemplates = function(el) {

    var promises = [];

    el.find('[type="text/x-handlebars-template"]').each(function(i, v) {

      var url = $(v).attr('src'),
          name = url.match(/([^\/]+)(?=\.\w+$)/)[0];

      promises.push($.get(url, function(data) {
        templates[name] = Handlebars.compile(data);
      }));

    });

    return promises;

  };

  config.renderForm = function(el) {

    var input = el.find('.input ul.dropdown-menu'),
        output = el.find('.output ul.dropdown-menu'),
        manager = el.find('.manager ul.dropdown-menu'),
        def;

    // default input
    def = $(templates.option(defaults.input));
    def.data('package', {http: true, included: 'HttpInput'});
    input.append(def);

    // default output
    def = $(templates.option(defaults.output));
    def.data('package', {http: true, included: 'HttpOutput'});
    output.append(def);

    // default manager
    def = $(templates.option(defaults.manager));
    def.data('package', {included: 'TelnetManager'});
    manager.append(def);

    $.each(el.data('packages'), function(i, p) {

      var option;

      if(! p.phantConfig) {
        return;
      }

      if(/^phant-input/.test(p.name)) {
        option = $(templates.option(p));
        option.data('package', p);
        return input.append(option);
      }

      if(/^phant-output/.test(p.name)) {
        option = $(templates.option(p));
        option.data('package', p);
        return output.append(option);
      }

      if(/^phant-manager/.test(p.name)) {
        option = $(templates.option(p));
        option.data('package', p);
        return manager.append(option);
      }

    });

  };

  config.changeOption = function(e) {

    var selected = $(this).children(':selected');

    $(this).after(JSON.stringify(selected.data('package')));

  };

  $.fn.configurator = function() {

    var promises = config.loadTemplates(this),
        el = this;

    $.when.apply(this, promises).done(function() {
      config.renderForm(el);
    });

    el.find('select[name=input]').change(config.changeOption);
    el.find('select[name=output]').change(config.changeOption);
    el.find('select[name=manager]').change(config.changeOption);

  };

}(jQuery));

