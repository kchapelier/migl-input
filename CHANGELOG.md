# migl-input - Changelog

## 2.0.0 (2015.05.02) :

 * Use a Command construct.
 * Implement universal `down`, `press` and `up` states.
 * Reduced memory churn.
 * Breaking change in the public API (`input.currentInput.UP` became `input.commands.UP.active`).

## 1.1.1 (2015.02.27) :

 * Fix warning for incomplete package.json.
 * Fix codestyle.

## 1.1.0 (2015.01.18) :

 * Gamepad support.

## 1.0.1 (2015.01.06) :

 * Add some documentation.
 * Fix an issue where commands without group were considered as part of the same `null` group.

## 1.0.0 (2014.12.24) :

 * Initial implementation, extracted from a ludum dare project.

