"use strict";

/**
 * Command constructor
 * @param {string} id Command id
 * @param {Object} options Command description (triggers and group)
 * @constructor
 */
var Command = function (id, options) {
    this.id = id;
    this.group = options.group;
    this.triggers = options.triggers || options.keys;

    this.reset();
};

Command.prototype.value = null;

Command.prototype.id = null;
Command.prototype.group = null;
Command.prototype.triggers = null;

Command.prototype.activationTime = null;
Command.prototype.active = null;

Command.prototype.up = null;
Command.prototype.down = null;
Command.prototype.press = null;

/**
 * Reset the state of the command
 * @private
 */
Command.prototype.reset = function () {
    this.value = 0;
    this.activationTime = 0;
    this.active = false;

    this.up = false;
    this.down = false;
    this.press = false;
};

module.exports = Command;
