if (Meteor.isClient) {
  Meteor.Router.add({
    '/': 'home',
    '/:page': function(page) { return page; }
  });
  
  Template.slider.helpers({
    currentScreen: function() {
      return Meteor.Transitioner.currentPage();
    },
    nextScreen: function() {
      return Meteor.Transitioner.nextPage();
    }
  });
  
  Template.buttons.events({
    'submit': function(e, template) {
      e.preventDefault();
      Meteor.Router.to('/' + template.find('input').value)
    }
  });
}
