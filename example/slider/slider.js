if (Meteor.isClient) {
  SliderRouter = ReactiveRouter.extend({
    routes: {
      '': 'home',
      ':page': 'page'
    },
    home: function() {
      this.goto('home');
    },
    page: function(page) {
      this.goto(page);
    }
  });
  
  Router = new SliderRouter();
  Transitioner.instance = new Transitioner();
  Meteor.startup(function() {
    Backbone.history.start({pushState: true});
    Transitioner.instance.init(Router);
  });
  
  Template.slider.helpers({
    currentScreen: function() {
      return Transitioner.instance.current_page();
    },
    nextScreen: function() {
      return Transitioner.instance.next_page();
    }
  });
  
  Template.buttons.events({
    'submit': function(e, template) {
      e.preventDefault();
      Router.navigate(template.find('input').value, {trigger: true});
    }
  });
}
