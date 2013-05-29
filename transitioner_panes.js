Template.transitionerFirstPane.firstPane = function() {
  var template = Template[Meteor.Transitioner.firstPane()];
  console.log(template);
  return template ? template() : '';
}
Template.transitionerSecondPane.secondPane = function() {
  var template = Template[Meteor.Transitioner.secondPane()];
  return template ? template() : '';
}