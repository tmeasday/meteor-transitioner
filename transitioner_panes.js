Template.transitionerFirstPane.firstPane = function() {
  var template = Template[Meteor.Transitioner.firstPane()];
  return template ? template() : '';
}
Template.transitionerSecondPane.secondPane = function() {
  var template = Template[Meteor.Transitioner.secondPane()];
  return template ? template() : '';
}