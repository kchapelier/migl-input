"use strict";

var Keyboard = require('./handlers/keyboard'),
    Gamepads = require('./handlers/gamepads');

var Input = function (commands) {
    this.setCommands(commands);

    this.currentTime = 0;

    this.keyboard = new Keyboard();
    this.gamepads = Gamepads.isSupported ? Gamepads : null;
};

Input.prototype.currentTime = 0;
Input.prototype.keyboard = null;
Input.prototype.gamepads = null;

Input.prototype.commands = null;
Input.prototype.inversedCommands = null;
Input.prototype.activeCommands = null;

Input.prototype.clearCurrentState = function () {
    this.currentInput = {};
    this.activeCommands = [];
};

Input.prototype.setCommands = function (commands) {
    this.clearCurrentState();
    this.commands = commands || {};
    this.createInverseLookupTable();
};

Input.prototype.createInverseLookupTable = function () {
    var index,
        keys,
        i;

    this.inversedCommands = {};

    for (index in this.commands) {
        if (this.commands.hasOwnProperty(index)) {
            keys = this.commands[index];

            for (i = 0; i < keys.keys.length; i++) {
                this.inversedCommands[keys.keys[i]] = {
                    command: index,
                    group: keys.group,
                    requireRevalidation: false,
                    validationTime: 0
                };
            }
        }
    }
};

Input.prototype.processHandlers = function () {
    this.processHandler(this.keyboard);
    this.processHandler(this.gamepads);
};

Input.prototype.processHandler = function (handler) {
    var input,
        command;

    handler.update();

    for (input in handler.inputs) {
        if (handler.inputs[input]) {
            command = this.inversedCommands[input];

            if (command) {
                command.validationTime = this.currentTime;
                command.value = handler.inputs[input];

                if (command && this.activeCommands.indexOf(command) === -1) {
                    this.activeCommands.push(command);
                }
            }
        }
    }
};

Input.prototype.update = function (dt) {
    var index;

    this.currentTime += dt;

    this.processHandlers();

    // clear the currentInput array
    for (index in this.commands) {
        this.currentInput[index] = 0;
    }

    this.clearInactiveCommands();
    this.processActiveCommands();
};

/**
 * Clear all commands which were not updated this time
 */
Input.prototype.clearInactiveCommands = function () {
    var activeCommands = this.activeCommands,
        command,
        i;

    for (i = activeCommands.length; i--;) {
        command = activeCommands[i];

        if (command.validationTime !== this.currentTime) {
            activeCommands.splice(activeCommands.lastIndexOf(command), 1);
        }
    }
};

/**
 * Repopulate the currentInput array while taking into account the groups
 */
Input.prototype.processActiveCommands = function () {
    var setGroup = {},
        command,
        i;

    for (i = this.activeCommands.length; i--;) {
        command = this.activeCommands[i];

        if (!command.group || !setGroup[command.group]) {
            setGroup[command.group] = true;
            this.currentInput[command.command] = command.value;
        }
    }
};

Input.prototype.attach = function (element) {
    element = element || document.body;

    this.keyboard.attach(element);
};

Input.prototype.detach = function (element) {
    element = element || document.body;

    this.keyboard.detach(element);
};

module.exports = Input;
