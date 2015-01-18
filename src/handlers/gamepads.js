"use strict";

var readButtons = function (inputs, gamepadIndex, buttons) {
    var l = 0;

    for (; l < buttons.length; l++) {
        if (buttons[l].pressed) {
            inputs['<pad' + gamepadIndex + '-button' + (l + 1) + '>'] = buttons[l].value;
        }
    }
};

var readAxes = function (inputs, gamepadIndex, axes) {
    var l = 0;

    for (; l < axes.length; l++) {
        // avoid firing off with stick bad calibration
        if (axes[l] > 0.1 || axes[l] < -0.1) {
            inputs['<pad' + gamepadIndex + '-axis' + (l + 1) + '>'] = axes[l];

            if (axes[l] > 0) {
                inputs['<pad' + gamepadIndex + '-axis' + (l + 1) + '-positive>'] = axes[l];
            } else {
                inputs['<pad' + gamepadIndex + '-axis' + (l + 1) + '-negative>'] = -axes[l];
            }
        }
    }
};

var updateInputs = function updateInputs (inputs, gamepads) {
    var k,
        i;

    for (k in inputs) {
        inputs[k] = 0;
    }

    for (i = 0; i < gamepads.length; i++) {
        var gamepad = gamepads[i],
            gamepadIndex = gamepad.index + 1;

        // TODO compatibility issue between webkit and firefox's buttons and axis numbering
        // Is it possible to fix it in userland ?

        readButtons(inputs, gamepadIndex, gamepad.buttons);
        readAxes(inputs, gamepadIndex, gamepad.axes);
    }
};

var Gamepads = {
    gamepads: [],
    inputs: {},
    isSupported: (function isSupported () {
        return !!window.navigator && typeof window.navigator.getGamepads === 'function';
    }()),
    update: function update () {
        var controllers = window.navigator.getGamepads(),
            gamepad,
            i;

        this.gamepads.splice(0, this.gamepads.length);

        for (i = 0; i < controllers.length; i++) {
            gamepad = controllers[i];

            if (gamepad && gamepad.connected) {
                this.gamepads.push(gamepad);
            }
        }

        updateInputs(this.inputs, this.gamepads);
    }
};

module.exports = Gamepads;
