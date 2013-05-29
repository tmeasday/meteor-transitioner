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

Tinytest.addAsync("Transitioner callbacks", function(test, done) {
  Meteor.Router.add({'/foo': 'foo', '/bar': 'bar'});
  Meteor.Router.to('/foo');
  Meteor.flush();
  
  var beforeDone = false, afterDone = false;
  Meteor.Transitioner.setOptions({
    before: function() {
      beforeDone = true;
    }, 
    after: function() {
      afterDone = true;
    }
  });
  
  test.equal(beforeDone, false);
  test.equal(afterDone, false);

  Meteor.Router.to('/bar');
  Meteor.flush();
  
  // the transition takes 1 ms, but we really need to wait longer
  Meteor.setTimeout(function() {
    test.equal(beforeDone, true);
    test.equal(afterDone, true);
    done()
  }, 100);
});

Tinytest.addAsync("Pane changes", function(test, done) {
  Meteor.Router.add({'/foo': 'foo', '/bar': 'bar'});
  Meteor.Router.to('/foo');
  Meteor.flush();
  
  var beforeDone = false, afterDone = false;
  Meteor.Transitioner.setOptions({
    before: function() {
      beforeDone = true;
    }, 
    after: function() {
      afterDone = true;
    }
  });
  
  test.equal(beforeDone, false);
  test.equal(afterDone, false);

  Meteor.Router.to('/bar');
  Meteor.flush();
  
  // the transition takes 1 ms, but we really need to wait longer
  Meteor.setTimeout(function() {
    test.equal(beforeDone, true);
    test.equal(afterDone, true);
    done()
  }, 100);
});
