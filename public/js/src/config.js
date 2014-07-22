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

      if(types.indexOf(type) === -1) {
        return;
      }

      option = $(templates.option(p));
      option.data('type', type);
      option.data('package', p);
      el.find('.' + type + ' ul.dropdown-menu').append(option);

    });

  };

  config.changeOption = function(e) {

    var selected = $(this),
        config = '';

    e.preventDefault();

    $.each(selected.data('package').phantConfig.options, function(i, opt) {

      if(opt.require === '') {
        return;
      }

      config += templates.input(opt);

    });

    if(selected.data('type') === 'input') {

      $('.inputs').append(templates.container({
        class: 'primary',
        name: 'Input - ' + selected.data('package').phantConfig.name,
        config: config
      }));

    }

    if(selected.data('type') === 'output') {

      $('.outputs').append(templates.container({
        class: 'success',
        name: 'Output - ' + selected.data('package').phantConfig.name,
        config: config
      }));

    }

    if(selected.data('type') === 'manager') {

      $('.managers').append(templates.container({
        class: 'info',
        name: 'Manager - ' + selected.data('package').phantConfig.name,
        config: config
      }));

    }

  };

  $.fn.configurator = function() {

    var promises = config.loadTemplates(this),
        el = this;

    $.when.apply(this, promises).done(function() {
      config.renderForm(el);
    });

    el.find('.input ul.dropdown-menu').on('click', 'li', config.changeOption);
    el.find('.output ul.dropdown-menu').on('click', 'li', config.changeOption);
    el.find('.manager ul.dropdown-menu').on('click', 'li', config.changeOption);

    el.on('click', '.panel button.close', function(e) {
      $(this).closest('.panel').remove();
    });

  };

}(jQuery));

