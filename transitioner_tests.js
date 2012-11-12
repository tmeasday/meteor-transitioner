Tinytest.addAsync("Transitioner variable changes", function(test, done) {
  Meteor.Router.add({'/foo': 'foo', '/bar': 'bar'});
  Meteor.Router.to('/foo');
  Meteor.flush();
  
  var transitioner = Meteor.Transitioner;
  test.equal(transitioner.currentPage(), 'foo');
  test.equal(transitioner.nextPage(), null);
  
  Meteor.Router.to('/bar');
  Meteor.flush();
  test.equal(transitioner.currentPage(), 'foo');
  test.equal(transitioner.nextPage(), 'bar');
  
  // the transition takes 1 ms, but we really need to wait longer
  Meteor.setTimeout(function() {
    test.equal(transitioner.currentPage(), 'bar');
    test.equal(transitioner.nextPage(), null);
    done()
  }, 100);
});