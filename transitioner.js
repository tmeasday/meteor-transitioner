// sits in front of the router and provides 'currentPage' and 'nextPage',
// whilst setting the correct classes on the body to allow transitions, namely:
//
//   body.transitioning.from_X.to_Y

(function() {
  var Transitioner = function() {
    this._currentPage = null;
    this._currentPageListeners = new Deps.Dependency();
    this._nextPage = null;
    this._nextPageListeners = new Deps.Dependency();
    this._options = {}
  }
  Transitioner.prototype._transitionEvents = 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner';
  
  Transitioner.prototype._transitionClasses = function() {
    return "transitioning from_" + this._currentPage + 
      " to_" + this._nextPage;
  }
  
  Transitioner.prototype.setOptions = function(options) {
    _.extend(this._options, options);
  }
  
  Transitioner.prototype.currentPage = function() {
    Deps.depend(this._currentPageListeners);
    return this._currentPage;
  }
  
  Transitioner.prototype._setCurrentPage = function(page) {
    this._currentPage = page;
    this._currentPageListeners.changed();
  }
  
  Transitioner.prototype.nextPage = function() {
    Deps.depend(this._nextPageListeners);
    return this._nextPage;
  }
  
  Transitioner.prototype._setNextPage = function(page) {
    this._nextPage = page;
    this._nextPageListeners.changed();
  }
  
  Transitioner.prototype.listen = function() {
    var self = this;

    Deps.autorun(function() {
      self.transition(Meteor.Router.page());
    });
  }
  
  // do a transition to newPage, if we are already set and there already
  //
  // note: this is called inside an autorun, so we need to take care to not 
  // do anything reactive.
  Transitioner.prototype.transition = function(newPage) {
    var self = this;
    
    // this is our first page? don't do a transition
    if (!self._currentPage)
      return self._setCurrentPage(newPage);
    
    // if we are transitioning already, quickly finish that transition
    if (self._nextPage)
      self.endTransition();
    
    // if we are transitioning to the page we are already on, no-op
    if (self._currentPage === newPage)
      return;
    
    // Start the transition -- first tell any listeners to re-draw themselves
    self._setNextPage(newPage);
    // wait until they are done/doing:
    Deps.afterFlush(function() {
      
      self._options.before && self._options.before();
      
      // add relevant classes to the body and wait for the body to finish 
      // transitioning (this is how we know the transition is done)
      $('body')
        .addClass(self._transitionClasses())
        .on(self._transitionEvents, function (e) {
          if ($(e.target).is('body'))
            self.endTransition();
        });
    })
  }
  
  Transitioner.prototype.endTransition = function() {
    var self = this;
    var classes = self._transitionClasses();
    
    // if nextPage isn't set, something weird is going on, bail
    if (! self._nextPage)
      return;
    
    // switch
    self._setCurrentPage(self._nextPage);
    self._setNextPage(null);
    
    // clean up our transitioning state
    Deps.afterFlush(function() {
      $('body').off('.transitioner').removeClass(classes);
      
      self._options.after && self._options.after();
    });
  }
  
  Meteor.Transitioner = new Transitioner();
  Meteor.startup(function() {
    Meteor.Transitioner.listen();
  });
}());
