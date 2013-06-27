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
    
    // this tells us if we are transitioning from A -> B or B -> A
    this._currentPageisFirstPane = true;
    this._firstPaneListeners = new Deps.Dependency();
    this._secondPaneListeners = new Deps.Dependency();    
  }
  Transitioner._TRANSITIONING_CLASS = 'transitioning';
  
  Transitioner.prototype._transitionEvents = 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner';
  
  Transitioner.prototype._transitionClasses = function() {
    return "from_" + this._currentPage + " to_" + this._nextPage;
  }
  
  Transitioner.prototype.setOptions = function(options) {
    _.extend(this._options, options);
  }
  
  Transitioner.prototype.currentPage = function() {
    this._currentPageListeners.depend();
    return this._currentPage;
  }
  
  Transitioner.prototype._setCurrentPage = function(page) {
    this._currentPage = page;
    this._currentPageListeners.changed();
  }
  
  Transitioner.prototype.nextPage = function() {
    this._nextPageListeners.depend();
    return this._nextPage;
  }
  
  Transitioner.prototype._setNextPage = function(page) {
    this._nextPage = page;
    this._nextPageListeners.changed();
  }
  
  Transitioner.prototype._firstOrsecondPane = function(first) {
    if (first === this._currentPageisFirstPane) {
      return this._currentPage;
    } else {
      return this._nextPage;
    }
  }
  
  Transitioner.prototype.firstPane = function() {
    this._firstPaneListeners.depend()
    return this._firstOrsecondPane(true);
  }
  
  Transitioner.prototype.secondPane = function() {
    this._secondPaneListeners.depend();
    return this._firstOrsecondPane(false);
  }
  
  
  Transitioner.prototype.listen = function() {
    var self = this;

    Deps.autorun(function() {
      self.transition(Meteor.Router.page());
    });
  }
  
  // XXX: I don't know if this is the best way to achieve this
  //
  // probably would be better to use a data-X on the link
  // and _stop_ the router from routing
  Transitioner.prototype.ignoreNextTransition = function(bool) {
    this._ignoreNextTransition = _.isUndefined(bool) ? true : bool;
  }
  
  // do a transition to newPage, if we are already set and there already
  //
  // note: this is called inside an autorun, so we need to take care to not 
  // do anything reactive.
  Transitioner.prototype.transition = function(newPage) {
    var self = this;
    
    console.log('transitioning to ' + newPage);
    
    // this is our first page? don't do a transition
    if (! self._currentPage || self._ignoreNextTransition) {
      self._ignoreNextTransition = false;
      
      self._setCurrentPage(newPage);
      // should always be true, but better to be sure
      if (this._currentPageisFirstPane) { 
        this._firstPaneListeners.changed();
      } else {
        this._secondPaneListeners.changed();
      }
      return;
    }
    
    // if we are transitioning already, quickly finish that transition
    if (self._nextPage)
      self.endTransition();
    
    // if we are transitioning to the page we are already on, no-op
    if (self._currentPage === newPage)
      return;
    
    // Setup the transition -- first tell any listeners to re-draw themselves
    // and set the informative class on the body.
    self._setNextPage(newPage);
    // now tell the correct page about it.
    if (this._currentPageisFirstPane) {
      this._secondPaneListeners.changed();
    } else {
      this._firstPaneListeners.changed();
    }
    
    $('body').addClass(self._transitionClasses())
    self._options.before && self._options.before();
    
    // let the DOM re-draw, then start the transition
    Meteor.defer(function() {
      
      // add relevant classes to the body and wait for the body to finish 
      // transitioning (this is how we know the transition is done)
      $('body')
        .addClass(Transitioner._TRANSITIONING_CLASS)
        .on(self._transitionEvents, function (e) {
          $(e.target).is('body') && self.endTransition();
        });
    });
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
    // now tell the right page to change too
    if (this._currentPageisFirstPane) {
      this._firstPaneListeners.changed();
    } else {
      this._secondPaneListeners.changed();
    }
    // we are going to switch the classes in _just a second_
    this._currentPageisFirstPane = !this._currentPageisFirstPane;
    
    // clean up our transitioning state
    Deps.afterFlush(function() {
      // Switch the classes
      $('#first-pane').toggleClass('current-page', self._currentPageisFirstPane)
        .toggleClass('next-page', !self._currentPageisFirstPane);
      $('#second-pane').toggleClass('current-page', !self._currentPageisFirstPane)
        .toggleClass('next-page', self._currentPageisFirstPane);
      
      
      $('body').off('.transitioner')
        .removeClass(classes).removeClass(Transitioner._TRANSITIONING_CLASS);
      
      self._options.after && self._options.after();
    });
  }
  
  Meteor.Transitioner = new Transitioner();
  Meteor.startup(function() {
    Meteor.Transitioner.listen();
  });
}());
