(function($) {

  var templates = {},
      config = {};

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

    var types = ['input', 'output', 'meta', 'manager', 'keychain'];

    $.each(el.data('packages'), function(i, p) {

      var type = p.name.split('-')[1],
          option;

      if(! p.phantConfig) {
        return;
      }

      if(type === 'stream') {
        type = 'output';
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
        config = selected.data('package').phantConfig,
        type = selected.data('type'),
        form = '';

    e.preventDefault();

    $.each(config.options, function(i, opt) {

      if(opt.require ) {
        form += templates.label(opt);
        return;
      }

      form += templates.input(opt);

    });

    $('.' + type + 's').append(templates.container({
      name: type.charAt(0).toUpperCase() + type.slice(1) + ' - ' + config.name,
      config: form
    }));

  };

  $.fn.configurator = function() {

    var promises = config.loadTemplates(this),
        el = this;

    $.when.apply(this, promises).done(function() {
      config.renderForm(el);
    });

    el.on('click', 'ul.dropdown-menu li', config.selectOption);

    el.on('click', '.panel button.close', function(e) {
      $(this).closest('.panel').remove();
    });

  };

}(jQuery));

