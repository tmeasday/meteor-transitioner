Tinytest.add("Transitioner variable changes", function(test) {
  var router = new ReactiveRouter();
  router.goto('foo');
  
  var transitioner = new Transitioner();
  transitioner.init(router);
  
  test.equal(transitioner.current_page(), 'foo');
  test.equal(transitioner.next_page(), undefined);
  
  router.goto('bar');
  Meteor.flush();
  test.equal(transitioner.current_page(), 'foo');
  test.equal(transitioner.next_page(), 'bar');
  
  // the transition takes 1 ms, but we really need to wait longer
  Tinytest.setTimeout(function() {
    test.equal(transitioner.current_page(), 'bar');
    test.equal(transitioner.next_page(), null);
  }, 100);
});