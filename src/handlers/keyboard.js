"use strict";

var vkey = require('vkey');

var Keyboard = function () {
    this.inputs = {};
    this.defineHandlers();
};

Keyboard.prototype.inputs = null;
Keyboard.prototype.keyDownHandler = null;
Keyboard.prototype.keyUpHandler = null;

Keyboard.prototype.update = function () {};

Keyboard.prototype.defineHandlers = function () {
    var self = this;

    this.keyDownHandler = function (e) {
        self.activateInput(vkey[e.keyCode]);
    };

    this.keyUpHandler = function (e) {
        self.deactivateInput(vkey[e.keyCode]);
    };
};

Keyboard.prototype.activateInput = function (input) {
    this.inputs[input] = 1;
};

Keyboard.prototype.deactivateInput = function (input) {
    this.inputs[input] = 0;
};

Keyboard.prototype.attach = function (element) {
    element.addEventListener('keydown', this.keyDownHandler);
    element.addEventListener('keyup', this.keyUpHandler);
};

Keyboard.prototype.detach = function (element) {
    element.removeEventListener('keydown', this.keyDownHandler);
    element.removeEventListener('keyup', this.keyUpHandler);
};

module.exports = Keyboard;
