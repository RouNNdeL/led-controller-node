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
        let color;
        if(device.colors[j] === undefined)
            color = 0;
        else
            color = parseInt(device.colors[j].replace(/(^|#)/, "0x"));
        if(device_n > 1) {
            array[index++] = (color >> 8);
            array[index++] = (color >> 16);
            array[index++] = color;
        }
        else {
            array[index++] = (color >> 16);
            array[index++] = (color >> 8);
            array[index++] = color;
        }
    }

    return array;
}

function globalsToBin(globals) {
    const array = new Uint8Array(22);
    let index = 0;

    for(let i = 0; i < 6; i++) {
        array[index++] = globals.brightness[i] / 100 * 255;
    }
    array[index++] = globals.profile_count;
    array[index++] = globals.current_profile;
    array[index++] = globals.leds_enabled ? 1 : 0;
    array[index++] = globals.fan_count;
    array[index++] = globals.auto_increment;

    for(let i = 0; i < 3; i++) {
        array[index++] = globals.fan_config[i];
    }
    for(let i = 0; i < 8; i++) {
        array[index++] = globals.profile_order[i];
    }

    return array;
}

function binToGlobals(buffer) {
    let index = 0;
    let globals = {};

    globals.brightness = [];

    for(let i = 0; i < 6; i++) {
        globals.brightness[i] = buffer[index++] / 255 * 100;
    }
    globals.profile_count = buffer[index++];
    globals.current_profile = buffer[index++];
    globals.leds_enabled = !!buffer[index++];
    globals.fan_count = buffer[index++];
    globals.auto_increment = buffer[index++];
    globals.fan_config = [];
    globals.profile_order = [];

    for(let i = 0; i < 3; i++) {
        globals.fan_config[i] = buffer[index++];
    }
    for(let i = 0; i < 8; i++) {
        globals.profile_order[i] = buffer[index++];
    }

    return globals;
}

function binToDebugInfo(buffer) {
    let info = {};
    info.frame = buffer[0] << 0 | buffer[1] << 8 | buffer[2] << 16 | buffer[3] << 24;
    info.flag_new_frame = (buffer[4] & (1 << 0)) > 0;
    info.flag_button =(buffer[4] & (1 << 1)) > 0;
    info.flag_reset = (buffer[4] & (1 << 2)) > 0;
    info.flag_profile_updated = (buffer[4] & (1 << 3)) > 0;
    info.flag_csgo_enabled = (buffer[4] & (1 << 4)) > 0;
    info.flag_debug_enabled = (buffer[4] & (1 << 5)) > 0;
    info.debug_buffer = [];
    for(let i = 5; i < buffer.length; i++)
    {
        info.debug_buffer.push(buffer[i]);
    }

    return info;
}

module.exports.profileToBin = profileToBin;
module.exports.deviceToBin = deviceToBin;
module.exports.globalsToBin = globalsToBin;

module.exports.binToGlobals = binToGlobals;
module.exports.binToDebugInfo = binToDebugInfo;