# IsoldaJS PubSub

This is a stand-alone Pub/Sub implementation ported from Backbone.Events.

Can be used both in Node.js and in the browser (`< 6Kb` minified and gzipped).

_It has the full Backbone's test suite ported as well._

The module can be mixed in to any object, giving the object the ability to bind and trigger custom named events. Events do not have to be declared before they are bound, and may take passed arguments. For example:

```
var _ = require('lodash');
var PubSub = require('@isoldajs/pubsub');

var object = {};

_.extend(object, PubSub);

object.on("alert", function(msg) {
  alert("Triggered " + msg);
});

object.trigger("alert", "an event");
```

For example, to make a handy event dispatcher that can coordinate events among different areas of your application: `var dispatcher = _.clone(PubSub)`.

## on `object.on(event, callback, [context])` _Alias: bind_

Bind a **callback** function to an object. The callback will be invoked whenever the event is fired. If you have a large number of different events on a page, the convention is to use colons to namespace them: `"poll:start"`, or `"change:selection"`. The event string may also be a space-delimited list of several events...

```
book.on("change:title change:author", ...);
```

To supply a **context** value for `this` when the callback is invoked, pass the optional third argument: `model.on('change', this.render, this)`.

Callbacks bound to the special `"all"` event will be triggered when any event occurs, and are passed the name of the event as the first argument. For example, to proxy all events from one object to another:

```
proxy.on("all", function(eventName) {
  object.trigger(eventName);
});
```

All PubSub event methods also support an event map syntax, as an alternative to positional arguments:

```
book.on({
  "change:title": titleView.update,
  "change:author": authorPane.update,
  "destroy": bookView.remove
});
```

## off `object.off([event], [callback], [context])` _Alias: unbind_

Remove a previously-bound **callback** function from an object. If no **context** is specified, all of the versions of the callback with different contexts will be removed. If no callback is specified, all callbacks for the **event** will be removed. If no event is specified, callbacks for _all_ events will be removed.

```
// Removes just the `onChange` callback.
object.off("change", onChange);

// Removes all "change" callbacks.
object.off("change");

// Removes the `onChange` callback for all events.
object.off(null, onChange);

// Removes all callbacks for `context` for all events.
object.off(null, null, context);

// Removes all callbacks on `object`.
object.off();
```

Note that calling `off` will indeed remove all events on the object — including events that other libraries may use for internal bookkeeping.

## trigger `object.trigger(event, [*args])`

Trigger callbacks for the given **event**, or space-delimited list of events. Subsequent arguments to `trigger` will be passed along to the event callbacks.

## once `object.once(event, callback, [context])`

Just like `on`, but causes the bound callback to fire only once before being removed. Handy for saying "the next time that X happens, do this". When multiple events are passed in using the space separated syntax, the event will fire once for every event you passed in, not once for a combination of all events

## listenTo `object.listenTo(other, event, callback)`

Tell an **object** to listen to a particular event on an **other** object. The advantage of using this form, instead of `other.on(event, callback, object)`, is that `listenTo` allows the **object** to keep track of the events, and they can be removed all at once later on. The **callback** will always be called with **object** as context.

```
view.listenTo(model, 'change', view.render);
```

## stopListening `object.stopListening([other], [event], [callback])`

Tell an object to stop listening to events. Either call `stopListening` with no arguments to have the object remove all of its registered callbacks ... or be more precise by telling it to remove just the events it's listening to on a specific object, or a specific event, or just a specific callback.

```
view.stopListening();

view.stopListening(model);
```

## listenToOnce `object.listenToOnce(other, event, callback)`

Just like `listenTo`, but causes the bound callback to fire only once before being removed.
