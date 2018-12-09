const effects = require("./constants").effects;
const args = require("./constants").args;

let single_breathe = {
    effect: effects.BREATHE,
    color_count: 3,
    times: [0, 32, 0, 32, 0, 0],
    args: [0, 0, 255, 0, 0, 1],
    colors: [0xff0000, 0x00ff00, 0x0000ff]
};

let rainbow_simple = {
    effect: effects.RAINBOW,
    color_count: 0,
    times: [0, 0, 0, 120, 0, 0],
    args: [0, 255],
    colors: []
};

let rainbow_digital = {
    effect: effects.RAINBOW,
    color_count: 0,
    times: [0, 0, 0, 0, 32, 0],
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
            colors: [0x0000ff, 0xff00ff]
        }, {
            effect: effects.BREATHE,
            color_count: 2,
            color_cycles: 2,
            times: [0, 24, 0, 24, 0, 0],
            args: [0, 0, 255],
            colors: [0xff0000, 0x0000ff]
        }, {
            effect: effects.FILL,
            color_count: 2,
            color_cycles: 1,
            times: [48, 24, 0, 24, 0, 48],
            args: [args.SMOOTH, 1, 1, 0, 0],
            colors: [0x960096, 0x00cc40]
        }]
    },
    "police": {
        devices: [{
            effect: effects.FADE,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 0, 0],
            args: [0],
            colors: [0x0000ff, 0xff0000]
        }, {
            effect: effects.FADE,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 0, 0],
            args: [0],
            colors: [0xff0000, 0x0000ff]
        }, {
            effect: effects.ROTATING,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 48],
            args: [args.SMOOTH | args.DIRECTION, 1, 4, 2],
            colors: [0xff0000, 0x0000ff, 0x0000ff, 0xff0000]
        }, {
            effect: effects.ROTATING,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 48],
            args: [args.SMOOTH, 1, 4, 2],
            colors: [0xff0000, 0x0000ff, 0x0000ff, 0xff0000]
        }, {
            effect: effects.ROTATING,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 48],
            args: [args.SMOOTH, 1, 4, 2],
            colors: [0xff0000, 0x0000ff, 0x0000ff, 0xff0000]
        }, {
            effect: effects.ROTATING,
            color_count: 2,
            color_cycles: 1,
            times: [0, 0, 40, 8, 48],
            args: [args.SMOOTH, 1, 4, 2],
            colors: [0xff0000, 0x0000ff, 0x0000ff, 0xff0000]
        }]
    },
    "test": {
        devices: [{
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 16, 0, 0, 0],
            args: [0, 0, 255],
            colors: [0xffffff, 0x0000ff, 0x00ff00, 0xff00ff, 0x00ffff, 0xffff00]
        }, rainbow_simple, {
            effect: effects.PIECES,
            color_count: 6,
            color_cycles: 1,
            times: [0, 0, 32, 16, 48],
            args: [args.SMOOTH, 3, 3],
            colors: [0xff0000, 0x0000ff, 0x00ff00, 0xff00ff, 0x00ffff, 0xffff00]
        }, {
            effect: effects.PIECES,
            color_count: 6,
            color_cycles: 1,
            times: [0, 0, 32, 16, 48],
            args: [args.SMOOTH | args.DIRECTION, 3, 3],
            colors: [0xff0000, 0x0000ff, 0x00ff00, 0xff00ff, 0x00ffff, 0xffff00]
        }, rainbow_digital, single_breathe]
    },
    "white": {
        devices: [{
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 3, 0, 0, 0],
            args: [0, 0, 255],
            colors: [0xffffff]
        }, {
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 3, 0, 0, 0],
            args: [0, 0, 255],
            colors: [0xffffff]
        }, {
            effect: effects.BREATHE,
            color_count: 1,
            color_cycles: 1,
            times: [0, 0, 3, 0, 0, 0],
            args: [0, 0, 255],
            colors: [0xffffff]
        }]
    }
};

const globals = {
    brightness: [100, 100, 100, 100, 100, 100],
    color: [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0, 0xff00ff],
    flags: [3, 3, 3, 3, 3, 3],
    current_device_profile: [0, 0, 0, 0, 0, 0],
    current_profile: 0,
    profile_count: 3,
    fan_count: 2,
    auto_increment: 0,
    fan_config: [2, 2, 2],
    profiles: [
        [0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ],
    profile_flags: [0]
};

module.exports.effects = effects_examples;
module.exports.globals = globals;