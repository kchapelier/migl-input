"use strict";

var vkey = require('vkey');

var Input = function (commands) {
    this.setCommands(commands);
    this.defineHandlers();
};

Input.prototype.commands = null;
Input.prototype.inversedCommands = null;
Input.prototype.activeCommands = null;
Input.prototype.currentInput = null;

Input.prototype.keyDownHandler = null;
Input.prototype.keyUpHandler = null;

Input.prototype.setCommands = function (commands) {
    this.currentInput = {};
    this.activeCommands = [];
    this.commands = commands || {};

    this.createInverseLookupTable();
};

Input.prototype.defineHandlers = function () {
    var self = this;

    this.keyDownHandler = function(e) {
        self.activateKey(vkey[e.keyCode]);
    };

    this.keyUpHandler = function(e) {
        self.deactivateKey(vkey[e.keyCode]);
    };
};

Input.prototype.createInverseLookupTable = function () {
    var index,
        keys,
        i;

    this.inversedCommands = {};

    for (index in this.commands) {
        if(this.commands.hasOwnProperty(index)) {
            keys = this.commands[index];

            for (i = 0; i < keys.keys.length; i++) {
                this.inversedCommands[keys.keys[i]] = {
                    command: index,
                    group: keys.group
                };
            }
        }
    }
};

Input.prototype.activateKey = function (key) {
    var command = this.inversedCommands[key];

    if(command && this.activeCommands.indexOf(command) === -1) {
        this.activeCommands.push(command);
    }
};

Input.prototype.deactivateKey = function (key) {
    var command = this.inversedCommands[key];

    if(command) {
        this.activeCommands.splice(this.activeCommands.lastIndexOf(command), 1);
    }
};

Input.prototype.update = function (dt) {
    var setGroup = {},
        command,
        index,
        i;

    for (index in this.commands) {
        this.currentInput[index] = false;
    }

    for (i = this.activeCommands.length; i--;) {
        command = this.activeCommands[i];

        if(!setGroup[command.group]) {
            setGroup[command.group] = true;
            this.currentInput[command.command] = true;
        }
    }
};

Input.prototype.attach = function(element) {
    element = element || document.body;
    element.addEventListener('keydown', this.keyDownHandler);
    element.addEventListener('keyup', this.keyUpHandler);
};

Input.prototype.detach = function(element) {
    element = element || document.body;
    element.removeEventListener('keydown', this.keyDownHandler);
    element.removeEventListener('keyup', this.keyUpHandler);
};

module.exports = Input;
