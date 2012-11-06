Meteor Transitioner
===================

_Read more about it here: http://bindle.me/blog/index.php/679/page-transitions-in-meteor-getleague-com_

_NOTE_: the above article uses outdated syntax.

## Install

Use [meteorite](http://possibilities.github.com/meteorite/). Then add via:

```bash
mrt add transitioner
```

## Usage

Set up your routes using the [Meteor Router](https://github.com/tmeasday/meteor-router) in the usual way. Then there are two additional reactive variables you can access:

```js
// the current page that should be drawn on the screen
Meteor.Transitioner.currentPage()

// the page that is currently coming onto the screen (null most of the time)
Meteor.Transitioner.nextPage()
```

Whilst the transition is happening, the `<body>` will have the class `transitioning`. The Transitioner waits for a transition on the body to finish so it knows when you've finished animating. So unless you have a legitimate animation to do on the body, set up a proxy animation. Here's an example:

```css
body {
  /* you'll need the standard -moz- etc */
  transition: opacity 0 linear 1000ms;
}
body.transitioning {
  opacity: 0.99999;
}
```

## Example

See `/example/slider` in this application. Run it with `mrt`.