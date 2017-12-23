const examples = require("./examples");

function profileToBin(effect) {
    const array = new Uint8Array(62 * 6);

    for(let i = 0; i < effect.devices.length; i++) {
        let index = 62 * i;
        const device = effect.devices[i];

        array[index++] = device.effect;
        array[index++] = device.color_count;
        array[index++] = device.color_cycles;

        for(let j = 0; j < 6; j++) {
            array[index++] = device.times[j];
        }
        for(let j = 0; j < 5; j++) {
            array[index++] = device.args[j];
        }

        for(let j = 0; j < 16; j++) {
            let color = device.colors[j];
            array[index++] = (color >> 16);
            array[index++] = (color >> 8);
            array[index++] = color;
        }
    }

    return array;
}

function deviceToBin(profile_n, device_n, device) {
    const array = new Uint8Array(64);
    let index = 0;

    array[index++] = profile_n;
    array[index++] = device_n;

    array[index++] = device.effect;
    array[index++] = device.color_count;
    array[index++] = device.color_cycles;

    for(let j = 0; j < 6; j++) {
        array[index++] = device.times[j];
    }
    for(let j = 0; j < 5; j++) {
        array[index++] = device.args[j];
    }

    for(let j = 0; j < 16; j++) {
        let color = device.colors[j];
        array[index++] = (color >> 16);
        array[index++] = (color >> 8);
        array[index++] = color;
    }

    return array;
}

function globalsToBin(globals) {
    const array = new Uint8Array(9);
    let index = 0;

    array[index++] = globals.brightness;
    array[index++] = globals.profile_count;
    array[index++] = globals.current_profile;
    array[index++] = globals.leds_enabled;
    array[index++] = globals.fan_count;
    array[index++] = globals.auto_increment;

    for(let i = 0; i < 3; i++) {
        array[index++] = globals.fan_config[i];
    }

    return array;
}

function binToGlobals(buffer) {
    let index = 0;
    let globals = {};

    globals.brightness = buffer[index++];
    globals.profile_count = buffer[index++];
    globals.current_profile = buffer[index++];
    globals.leds_enabled = buffer[index++];
    globals.fan_count = buffer[index++];
    globals.auto_increment = buffer[index++];
    globals.fan_config = [];

    for(let i = 0; i < 3; i++) {
        globals.fan_config[i] = buffer[index++];
    }

    return globals;
}

module.exports.profileToBin = profileToBin;
module.exports.deviceToBin = deviceToBin;
module.exports.globalsToBin = globalsToBin;

module.exports.binToGlobals = binToGlobals;