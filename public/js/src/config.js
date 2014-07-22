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

    var input = el.find('.input ul.dropdown-menu'),
        output = el.find('.output ul.dropdown-menu'),
        manager = el.find('.manager ul.dropdown-menu'),
        def;

    $.each(el.data('packages'), function(i, p) {

      var option;

      if(! p.phantConfig) {
        return;
      }

      if(/^phant-input/.test(p.name)) {
        option = $(templates.option(p));
        option.data('type', 'input');
        option.data('package', p);
        return input.append(option);
      }

      if(/^phant-output/.test(p.name)) {
        option = $(templates.option(p));
        option.data('type', 'output');
        option.data('package', p);
        return output.append(option);
      }

      if(/^phant-manager/.test(p.name)) {
        option = $(templates.option(p));
        option.data('type', 'manager');
        option.data('package', p);
        return manager.append(option);
      }

    });

  };

  config.changeOption = function(e) {

    var selected = $(this),
        config = '';

    e.preventDefault();

    $.each(selected.data('package').phantConfig.options, function(i, opt) {

      if(opt.type === 'select') {
        return;
      }
      console.log(opt);

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

  };

}(jQuery));

