(function($) {

  var templates = {},
      config = {}
      require = { input: false, output: false, meta: true, keychain: true, stream: false, manager: false };

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

  config.fillDropdowns = function(el) {

    var types = ['input', 'output', 'stream', 'meta', 'manager', 'keychain'];

    $.each(el.data('packages'), function(i, p) {

      var type = p.name.split('-')[1],
          option;

      if(! p.phantConfig) {
        return;
      }

      if(types.indexOf(type) === -1) {
        return;
      }

      option = $(templates.option(p));
      option.data('type', type);
      option.data('package', p);
      el.find('.' + type + ' ul.dropdown-menu').append(option);

    });

  };

  config.selectOption = function(e) {

    var selected = $(this),
        conf = selected.data('package').phantConfig,
        type = selected.data('type');

    e.preventDefault();

    if(type !== 'meta' && type !== 'keychain')  {
      $('.' + type + 's').append(config.buildContainer(type, conf));
    } else {
      $('.' + type + 's').html(config.buildContainer(type, conf));
    }

  };

  config.addDefaults = function(el) {

    var packages = el.data('packages');

    $('.inputs').html(this.buildContainer('input', packages['phant-input-http'].phantConfig));
    $('.outputs').html(this.buildContainer('output', packages['phant-output-http'].phantConfig));
    $('.streams').html(this.buildContainer('storage', packages['phant-stream-csv'].phantConfig));
    $('.managers').html(this.buildContainer('manager', packages['phant-manager-telnet'].phantConfig));
    $('.metas').html(this.buildContainer('meta', packages['phant-meta-nedb'].phantConfig));
    $('.keychains').html(this.buildContainer('keychain', packages['phant-keychain-hex'].phantConfig));

  };

  config.buildContainer = function(type, config) {

    var form = '';

    if(config.http) {
      form += templates.input({
        label: 'Port',
        name: 'http_port',
        default: '8080',
        description: 'The TCP port to use for the http server.'
      });
    }

    $.each(config.options, function(i, opt) {

      if(opt.require) {
        require[opt.require] = true;
        form += templates.label(opt);
        return;
      }

      form += templates.input(opt);

    });

    return templates.container({
      name: type.charAt(0).toUpperCase() + type.slice(1) + ' - ' + config.name,
      config: form
    });

  };

  config.validate = function(el) {

    if(require.meta) {

      if(el.find('.metas').children().length > 1) {
        throw 'You only need one metadata module. Please remove one.';
      }

      if(el.find('.metas').children().length < 1) {
        throw 'You must select a metadata module.';
      }

    }

    if(require.keychain) {

      if(el.find('.keychains').children().length > 1) {
        throw 'You only need one keychain module. Please remove one.';
      }

      if(el.find('.keychains').children().length < 1) {
        throw 'You must select a keychain module.';
      }

    }

    if(require.stream) {

      if(el.find('.streams').children().length < 1) {
        throw 'You must select a storage module.';
      }

    }

    if(require.manager) {

      if(el.find('.managers').children().length < 1) {
        throw 'You must select a manager module.';
      }

    }

    el.find('.panel input').each(function() {

      var title = $(this).closest('.panel').find('panel-heading').html();

      title += ' - ' + $(this).closest('.form-group').find('label').html();

      if($(this).val().trim() === '') {
        throw 'Missing: ' + title;
      }

    });

  };

  config.download = function(el) {

    

  };

  config.publish = function(el) {

    bootbox.prompt('Enter the name of your package. It will be published to npm with the prefix of "phantconfig-"', function(result) {

      if(! result) {
        return;
      }

      config.message('Checking npm for packages named phantconfig-' + result, true);

      config.checkName(result).then(function(res) {
        config.message();
        console.log(res.exists);
      });

    });

  };

  config.checkName = function(name) {

    return $.get('/config/exists/' + name);

  };

  config.message = function(message, spinner) {

    if(! spinner) {
      $('.spinner').hide();
    } else {
      $('.spinner').show();
    }

    if(! message) {
      $('.modules').each(function(){ $(this).show(); });
      $('.button-container').show();
      $('.controls').show();
      $('#message').html('');
      return;
    }

    $('#message').html(message);
    $('.modules').each(function(){ $(this).hide(); });
    $('.button-container').hide();
    $('.controls').hide();

  }

  $.fn.configurator = function() {

    var promises = config.loadTemplates(this),
        el = this;

    $.when.apply(this, promises).done(function() {
      config.addDefaults(el);
      config.fillDropdowns(el);
    });

    el.on('click', 'ul.dropdown-menu li', config.selectOption);

    el.on('click', '.panel button.close', function(e) {
      $(this).closest('.panel').remove();
    });

    el.on('click', '.validate',  function(e) {

      e.preventDefault();

      try {
        config.validate(el);
        config[$(this).data('action')].call(this, el);
      } catch(err) {
        bootbox.alert(err);
        return;
      }

    });

    el.on('keyup', '[name=http_port]', function(e) {

      var port = $(this).val();

      e.preventDefault();

      $('[name=http_port]').each(function() {
        $(this).val(port);
      });

    });

  };

}(jQuery));

