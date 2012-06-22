Package.describe({
  summary: "A wrapper around a reactive router to easy page->page transitions"
});

Package.on_use(function (api, where) {
  api.use('router', 'client');
  api.use('deps-extensions', 'client');
  api.use('jquery', 'client');
  api.add_files('transitioner.js', 'client');
});


Package.on_test(function (api) {
  api.use('transitioner', 'client');
  api.use('test-helpers', 'client');
  api.use('tinytest', 'client');

  api.add_files('transitioner_tests.js', 'client');
  api.add_files('transitioner_tests.css', 'client');
});
