"use strict";

var Keyboard = require('./handlers/keyboard'),
    Gamepads = require('./handlers/gamepads'),
    Command = require('./command');

/**
 * Input constructor
 * @param {Array} commands Array of command descriptions
 * @constructor
 */
var Input = function (commands) {
    this.activeCommands = [];

    this.setCommands(commands);

    this.currentTime = 0;

    this.keyboard = new Keyboard();
    this.gamepads = Gamepads.isSupported ? Gamepads : null;
};

Input.prototype.currentTime = null;
Input.prototype.keyboard = null;
Input.prototype.gamepads = null;

Input.prototype.commands = null;
Input.prototype.inversedCommands = null;
Input.prototype.activeCommands = null;

/**
 * Define the commands
 * @param {Array} commands Array of command descriptions
 */
Input.prototype.setCommands = function (commands) {
    var command = null,
        commandId = null,
        i;

    this.activeCommands.length = 0;

    //TODO avoid the creation of all new objects below
    //TODO should update the commands when possible, not recreate them

    this.commands = {};
    this.inversedCommands = {};

    for (commandId in commands) {
        if (commands.hasOwnProperty(commandId)) {
            command = new Command(commandId, commands[commandId]);

            this.commands[commandId] = command;

            for (i = 0; i < command.triggers.length; i++) {
                this.inversedCommands[command.triggers[i]] = command;
            }
        }
    }
};

/**
 * Clear the current state of the commands
 */
Input.prototype.clearCurrentState = function () {
    var index;

    this.activeCommands.length = 0;

    for (index in this.commands) {
        this.commands[index].reset();
    }
};

/**
 * Update the state of all the commands
 * @param {number} dt Delta time, time elapsed since the last update in millisecond
 */
Input.prototype.update = function (dt) {
    var command,
        index;

    this.currentTime += dt;

    this.processHandlers();

    for (index in this.commands) {
        command = this.commands[index];
        command.active = false;
        command.up = false;

        if (command.value) {
            command.down = command.press === false;
            command.press = true;
        } else {
            command.down = false;
            command.press = false;
        }
    }

    this.clearInactiveCommands();
    this.processActiveCommands();
};

/**
 * Process all the input handlers (keyboard and gamepads)
 * @private
 */
Input.prototype.processHandlers = function () {
    this.processHandler(this.keyboard);
    this.processHandler(this.gamepads);
};

/**
 * Process a specific input handler
 * @private
 * @param {Object} handler Input handler
 */
Input.prototype.processHandler = function (handler) {
    var input,
        command;

    handler.update();

    for (input in handler.inputs) {
        command = this.inversedCommands[input];

        if (command) {
            command.value = handler.inputs[input];

            if (command.value) {
                command.validationTime = this.currentTime;

                if (this.activeCommands.indexOf(command) === -1) {
                    this.activeCommands.push(command);
                }
            }
        }
    }
};

/**
 * Clear all commands which were not updated this time
 * @private
 */
Input.prototype.clearInactiveCommands = function () {
    var activeCommands = this.activeCommands,
        command,
        i;

    for (i = activeCommands.length; i--;) {
        command = activeCommands[i];

        if (command.validationTime !== this.currentTime) {
            command.up = true;
            activeCommands.splice(activeCommands.lastIndexOf(command), 1);
        }
    }
};

/**
 * Activating the commands while taking into account the groups
 * @private
 */
Input.prototype.processActiveCommands = function () {
    var setGroup = {},
        command,
        i;

    for (i = this.activeCommands.length; i--;) {
        command = this.activeCommands[i];

        if (!command.group || !setGroup[command.group]) {
            setGroup[command.group] = true;
            command.active = true;
        }
    }
};

/**
 * Attach the input handlers to a DOM element, add events
 * @param {HTMLElement} element
 */
Input.prototype.attach = function (element) {
    element = element || document.body;

    this.keyboard.attach(element);
};

/**
 * Detach the input handlers from a DOM element, remove events
 * @param {HTMLElement} element
 */
Input.prototype.detach = function (element) {
    element = element || document.body;

    this.keyboard.detach(element);
};

module.exports = Input;
