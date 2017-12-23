const effects = require("./constants").effects;
const args = require("./constants").args;

let single_breathe = {
    effect: effects.BREATHE,
    color_count: 3,
    color_cycles: 1,
    times: [0, 16, 0, 16, 0, 0],
    args: [0, 0, 255],
    colors: [0xFF0000, 0x00FF00, 0x0000FF]
};

let rainbow_simple = {
    effect: effects.RAINBOW,
    color_count: 0,
    color_cycles: 0,
    times: [0, 0, 0, 80, 0, 0],
    args: [0, 160],
    colors: []
};

let rainbow_digital = {
    effect: effects.RAINBOW,
    color_count: 0,
    color_cycles: 0,
    times: [0, 0, 0, 16, 0, 0],
    args: [args.RAINBOW_MODE, 100, 1],
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
            times: [24, 12, 0, 12, 0, 12],
            args: [0,0,255],
            colors: [0x0000ff, 0xff00ff]
        },{
            effect: effects.BREATHE,
            color_count: 2,
            color_cycles: 2,
            times: [0, 12, 0, 12, 0, 0],
            args: [0,0,255],
            colors: [0xff0000, 0x0000ff]
        },{
            effect: effects.FILL,
            color_count: 2,
            color_cycles: 1,
            times: [24, 12, 0, 12, 0, 24],
            args: [args.SMOOTH, 1, 1, 0, 0],
            colors: [0x960096, 0x00cc40]
        }]
    }
};

const globals = {
    brightness: 255,
    profile_count: 3,
    current_profile: 0,
    leds_enabled: 1,
    fan_count: 1,
    auto_increment: 0,
    fan_config: [2, 0, 0]
};

module.exports.effects = effects_examples;
module.exports.globals = globals;