const effects = require("./constants").effects;
const args = require("./constants").args;

let single_breathe = {
    effect: effects.BREATHE,
    color_count: 3,
    color_cycles: 1,
    times: [0, 8, 0, 8, 0, 0],
    args: [args.SMOOTH, 0, 255],
    colors: [0xFF0000, 0x00FF00, 0x0000FF]
};

const examples = {
    "rgb-breathe": {
        devices: [single_breathe, single_breathe, single_breathe,
            single_breathe, single_breathe, single_breathe]
    }
};

module.exports = examples;