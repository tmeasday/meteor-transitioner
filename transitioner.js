// sits in front of the router and provides 'current_page' and 'next_page',
// whilst setting the correct classes on the body to allow transitions, namely:
//
// body.transitioning.from_X.to_Y
Transitioner = function() {
  Meteor.deps.add_reactive_variable(this, 'current_page', 'loading');
  Meteor.deps.add_reactive_variable(this, 'next_page');
}
Transitioner._transition_events = 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner';
Transitioner.prototype = {
  init: function(Router) {
    var self = this;
    
    self.current_page.set(Router.current_page())
    Meteor.deps.await(function () { return Router.current_page() !== self.current_page(true) }, function() {
      self.transition_to(Router.current_page());
    });
  },
  
  // we need to be careful not to do anything reactive in here or we can get into loops
  transition_to: function(new_page) {
    var self = this;
    
    // better kill the current transition
    if (self.next_page(true))
      self.transition_end();
    
    if (new_page === self.current_page(true))
      return;
    
    // Start the transition (need to wait until meteor + the browser has rendered...)
    self.next_page.set(new_page)
    Meteor.defer(function() {
      // we want to wait until the TE event has fired for both containers
      $('body')
        .addClass(self._transition_classes())
        .on(Transitioner._transition_events, function (e) {
          if ($(e.target).is('body'))
            self.transition_end();
        });
    });
  },
  
  transition_end: function() {
    var classes = this._transition_classes();
    $('body').off('.transitioner').removeClass(classes);
    
    // if there isn't a next page to go to, we can't do the switch
    if (!this.next_page(true))
      return;
    
    this.current_page.set(this.next_page(true));
    this.next_page.set(null);
    
    // we need to ensure that the divs have changed before the body loses the 
    // transitioning class. 
    // XXX: use Meteor._atFlush to do this, once it's in master + public
    Meteor.flush();
  },
  
  _transition_classes: function() {
    return "transitioning from_" + this.current_page(true) + 
      " to_" + this.next_page(true);
  }
}