import kaboom from "kaboom";

export const k = kaboom({
    //passing  global: false will prevent k from being added to the global scope
    global: false,
    touchToMouse: true, //translate all touch events into mouse events
    canvas: document.getElementById("game"), //canvas element
});