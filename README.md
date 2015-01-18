# migl-input

Micro Game Library : Input (keyboard and gamepads)

## Features

* Avoid naïve input prioritization with grouping (only the last active command in a group is considered active)
* The input can be attached and detached from any dom element at any time
* Built with customizable control settings in mind
* Several instances can run at the same time on a given web page
* Support for the Gamepad API


## Basic example

```js
/*
Instantiation of the input handler and description of the control scheme.
We bind the directional keys as well as the traditional WASD keys, the first gamepad d-pad and first stick
to our UP, DOWN, LEFT and RIGHT commands
*/

var Input = require('migl-input');

var input = new Input({
    UP: {
        keys: ['<up>', 'W', '<pad1-button13>', '<pad1-axis2-negative>'],
        group: 'verticalAxis'
    },
    DOWN: {
        keys: ['<down>', 'S', '<pad1-button14>', '<pad1-axis2-positive>'],
        group: 'verticalAxis'
    },
    LEFT: {
        keys: ['<left>', 'A', '<pad1-button15>', '<pad1-axis1-negative>'],
        group: 'horizontalAxis'
    },
    RIGHT: {
        keys: ['<right>', 'D', '<pad1-button16>', '<pad1-axis1-positive>'],
        group: 'horizontalAxis'
    }
});

input.attach(); // attached to the body

/*
Code handling the user input in the game loop
*/

input.update(deltaTime);

if(input.currentInput.LEFT) {
    moveLeft();
} else if(input.currentInput.RIGHT) {
    moveRight();
}

if(input.currentInput.UP) {
    moveUp();
} else if(input.currentInput.DOWN) {
    moveDown();
}
```

## More information

### Key codes

This library relies on the `vkey` module to map keyboard's codes to human readable names.

Check the module's [repository](https://github.com/chrisdickinson/vkey) for more information.

For the gamepads :

* `<padX-buttonY>`
* `<padX-axisY>`
* `<padX-axisY-negative>`
* `<padX-axisY-positive>`

Where X is the pad's number (starting from 1) and Y the button's or axis' number (starting from 1).

### Attaching and detaching

The methods `attach(domElement)` and `detach(domElement)` are exposed by the library.

They take a domElement to be attached to or detached from, if non is given the methods are executed against the body of the document.

```js
input.attach(); // implicitly attached to the body
input.detach(document.body); // explicitly detached from the body
```

### Grouping

Example of a naïve input handling :

```js
if(keyLeftPressed) {
    moveLeft();
} else if(keyRightPressed) {
    moveRight();
}
```

The issue with such code is that the left key will always have the priority over the right key, making movements imprecise and unresponsive when the player quickly changes from left to right. A more correct way to handle input would be to prioritize the last input.

The library allows this with its concept of commands grouping.

```js
var input = new Input({
    left : { keys : ['<left>'], group : 'horizontalAxis' },
    right : { keys : ['<right>'], group : 'horizontalAxis' }
});

input.attach();

if(input.currentInput.left) {
    moveLeft();
} else if(input.currentInput.right) {
    moveRight();
}
```

Since `left` and `right` are both in the same group, only the last active command is taken into account. Its means
that when pressing the right key while the left key is already pressed, the left command will be automatically disabled.

### Customizable control settings

The commands being described in a data structure instead of a lump of code simplifies the implementation of
user-modifiable control settings.

```js
var input = new Input(defaultInputScheme);

// The user access the control settings and
// a new data structure with his settings is created

input.setCommands(newInputScheme);
```

### Input buffering

Several game genres, such as fighting games, rely on input buffering. This concept is out of the scope of this particular library.
