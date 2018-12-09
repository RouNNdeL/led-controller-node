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

    for(let j = 0; j < 6; j++) {
        array[index++] = device.times[j];
    }
    for(let j = 0; j < 6; j++) {
        array[index++] = device.args[j];
    }

    for(let j = 0; j < 16; j++) {
        let color;
        color = device.colors[j] === undefined ? 0 : device.colors[j];
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
    const array = new Uint8Array(99);
    let index = 0;

    for(let i = 0; i < 6; i++) {
        array[index++] = globals.brightness[i] / 100 * 255;
    }
    for(let i = 0; i < 6; i++) {
        let color = globals.color[i];
        array[index++] = (color >> 16);
        array[index++] = (color >> 8);
        array[index++] = color;
    }
    for(let i = 0; i < 6; i++) {
        array[index++] = globals.flags[i];
    }
    for(let i = 0; i < 6; i++) {
        array[index++] = globals.current_device_profile[i];
    }
    array[index++] = globals.profile_count;
    array[index++] = globals.current_profile;
    array[index++] = globals.fan_count;
    array[index++] = globals.auto_increment;

    for(let i = 0; i < 3; i++) {
        array[index++] = globals.fan_config[i];
    }
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 6; j++) {
            if(globals.profiles[i] !== undefined)
                array[index++] = globals.profiles[i][j];
            else
                array[index++] = 0;
        }
    }
    for(let i = 0; i < 8; i++) {
        array[index++] = globals.profile_flags[i]
    }

    return array;
}

function binToGlobals(buffer) {
    let index = 0;
    let globals = {};

    globals.brightness = [];
    globals.color = [];
    globals.flags = [];
    globals.current_device_profile = [];
    globals.fan_count = [];
    globals.fan_config = [];
    globals.profiles = [];
    globals.profile_flags = [];

    for(let i = 0; i < 6; i++) {
        globals.brightness[i] = buffer[index++] / 255 * 100;
    }
    for(let i = 0; i < 6; i++) {
        globals.color[i] = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16;
    }
    for(let i = 0; i < 6; i++) {
        globals.flags[i] = buffer[index++];
    }
    for(let i = 0; i < 6; i++) {
        globals.current_device_profile[i] = buffer[index++];
    }
    globals.profile_count = buffer[index++];
    globals.current_profile = buffer[index++];
    globals.fan_count = buffer[index++];
    globals.auto_increment = buffer[index++];

    for(let i = 0; i < 3; i++) {
        globals.fan_config[i] = buffer[index++];
    }
    for(let i = 0; i < 8; i++) {
        globals.profiles[i] = [];
        for(let j = 0; j < 6; j++) {
            globals.profiles[i][j] = new Int8Array(new Uint8Array([buffer[index++]]).buffer)[0];
        }
    }
    for(let i = 0; i < 8; i++) {
        globals.profile_flags[i] = buffer[index++];
    }

    return globals;
}

function binToDebugInfo(buffer) {
    let info = {};
    info.frame = buffer[0] << 0 | buffer[1] << 8 | buffer[2] << 16 | buffer[3] << 24;
    info.flag_new_frame = (buffer[4] & (1 << 0)) > 0;
    info.flag_button = (buffer[4] & (1 << 1)) > 0;
    info.flag_reset = (buffer[4] & (1 << 2)) > 0;
    info.flag_profile_updated = (buffer[4] & (1 << 3)) > 0;
    info.flag_csgo_enabled = (buffer[4] & (1 << 4)) > 0;
    info.flag_debug_enabled = (buffer[4] & (1 << 5)) > 0;
    info.debug_buffer = [];
    for(let i = 5; i < buffer.length; i++) {
        info.debug_buffer.push(buffer[i]);
    }

    return info;
}

module.exports.profileToBin = profileToBin;
module.exports.deviceToBin = deviceToBin;
module.exports.globalsToBin = globalsToBin;

module.exports.binToGlobals = binToGlobals;
module.exports.binToDebugInfo = binToDebugInfo;