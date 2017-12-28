const effects = require("./constants").effects;
const args = require("./constants").args;

let single_breathe = {
    effect: effects.BREATHE,
    color_count: 3,
    color_cycles: 1,
    times: [0, 32, 0, 32, 0, 0],
    args: [0, 0, 255],
    colors: ["#ff0000", "#00ff00", "#0000ff"]
};

let rainbow_simple = {
    effect: effects.RAINBOW,
    color_count: 0,
    color_cycles: 0,
    times: [0, 0, 0, 120, 0, 0],
    args: [0, 255],
    colors: []
};

let rainbow_digital = {
    effect: effects.RAINBOW,
    color_count: 0,
    color_cycles: 0,
    times: [0, 0, 0, 32, 0, 0],
    args: [args.RAINBOW_MODE, 255, 1],
    colors: []
};

const effects_examples = {
    "rgb-breathe": {
        devices: [single_breathe, single_breathe, single_breathe,
            single_breathe, single_breathe, single_breathe]
    },
    "rainbow": {
        devices: [rainbow_simple, rainbow_simple, rainbow_digital,
            rainbow_digital, rainbow_digital, rainbow_digital]
    },
    "tata": {
        devices: [{
            effect: effects.BREATHE,
            color_count: 2,
            color_cycles: 1,
            times: [48, 24, 0, 24, 0, 24],
            args: [0, 0, 255],
            colors: ["#0000ff", "#ff00ff"]
        }, {
            effect: effects.BREATHE,
            color_count: 2,
            color_cycles: 2,
            times: [0, 24, 0, 24, 0, 0],
            args: [0, 0, 255],
            colors: ["#ff0000", "#0000ff"]
        }, {
            effect: effects.FILL,
            color_count: 2,
            color_cycles: 1,
            times: [48, 24, 0, 24, 0, 48],
            args: [args.SMOOTH, 1, 1, 0, 0],
            colors: ["#960096", "#00cc40"]
        }]
    },
    "police": {
        devices: [{
            effect: effects.FADE,
            color_count: 2,
            color_cycles: 1,
                    times: [0, 0, 40, 8, 0, 0],
            args: [0],
            colors: ["#0000ff", "#ff0000"]
        }, {
            effect: effects.FADE,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 0, 0],
            args: [0],
            colors: ["#ff0000", "#0000ff"]
        }, {
            effect: effects.ROTATING,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 48],
            args: [args.SMOOTH | args.DIRECTION, 1, 4, 2],
            colors: ["#ff0000", "#0000ff", "#0000ff", "#ff0000"]
        }]
    },
    "test": {
        devices: [{
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 16, 0, 0, 0],
            args: [0, 0, 255],
            colors: ["#ffffff", "#0000ff", "#00ff00", "#ff00ff", "#00ffff", "#ffff00"],
            brightness: 75
        }, {
            effect: effects.BREATHE,
            color_count: 6,
            color_cycles: 1,
            times: [0, 0, 16, 0, 0, 0],
            args: [0, 0, 255],
            colors: ["#ff0000", "#0000ff", "#00ff00", "#ff00ff", "#00ffff", "#ffff00"]
        }, {
            effect: effects.PIECES,
            color_count: 6,
            color_cycles: 1,
            times: [0, 0, 32, 16, 8],
            args: [args.SMOOTH, 3, 3],
            colors: ["#ff0000", "#0000ff", "#00ff00", "#ff00ff", "#00ffff", "#ffff00"]
        }]
    },
    "white": {
        devices: [{
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 3, 0, 0, 0],
            args: [0, 0, 255],
            colors: ["#ffffff"]
        }, {
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 3, 0, 0, 0],
            args: [0, 0, 255],
            colors: ["#ffffff"]
        }, {
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 3, 0, 0, 0],
            args: [0, 0, 255],
            colors: ["#ffffff"]
        }]
    }
};

const globals = {
    brightness: 255,
    profile_count: 5,
    current_profile: 0,
    leds_enabled: 1,
    fan_count: 1,
    auto_increment: 0,
    fan_config: [2, 0, 0]
};

module.exports.effects = effects_examples;
module.exports.globals = globals;