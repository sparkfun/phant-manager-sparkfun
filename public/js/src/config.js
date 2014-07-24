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
        type = selected.data('type');

    e.preventDefault();

    $('.' + type + 's').append(this.buildContainer(type, config));

  };

  config.addDefaults = function(el) {

    var packages = el.data('packages');

    $('.inputs').html(this.buildContainer('input', packages['phant-input-http'].phantConfig));
    $('.outputs').html(this.buildContainer('output', packages['phant-output-http'].phantConfig));
    $('.managers').html(this.buildContainer('manager', packages['phant-manager-telnet'].phantConfig));
    $('.metas').html(this.buildContainer('meta', packages['phant-meta-nedb'].phantConfig));
    $('.keychains').html(this.buildContainer('keychain', packages['phant-keychain-hex'].phantConfig));

  };

  config.buildContainer = function(type, config) {

    var form = '';

    $.each(config.options, function(i, opt) {

      if(opt.require ) {
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

  $.fn.configurator = function() {

    var promises = config.loadTemplates(this),
        el = this;

    $.when.apply(this, promises).done(function() {
      config.addDefaults(el);
      config.renderForm(el);
    });

    el.on('click', 'ul.dropdown-menu li', config.selectOption);

    el.on('click', '.panel button.close', function(e) {
      $(this).closest('.panel').remove();
    });

  };

}(jQuery));

