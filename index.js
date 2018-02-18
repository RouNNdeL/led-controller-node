const effects = require("./effects");
const serial = require("./serial_interface");
const codes = serial.codes;
const log4js = require("log4js");
const server = require("./network").receiver;
const http = require("./network").http;
const csgo = require("./csgo");
const player = require('play-sound')(opts = {});

let globals;
let audio;
let demo_playing;
let sending = true;
let action_buffer = [];

log4js.configure({
    appenders: {
        out: {type: "stdout"},
        file: {type: "file", filename: "app.log"}
    },
    categories: {
        default: {appenders: ["out", "file"], level: "trace"}
    }
});
const logger = log4js.getLogger();

const port = serial.begin(function(e) {
    if(e !== null) {
        logger.fatal(e);
        process.exit(0xE0);
    }
});

const REGISTER_MAX_RETRIES = 24;
server.listen(() => {
    let tries = 0;

    function attemptRegister() {
        tries++;
        http.register(server.address().port, function(err, resp, content) {
            if(err !== null) {
                logger.error("Failed to register, attempt", tries);
                logger.warn(err);
                if(tries < REGISTER_MAX_RETRIES)
                    attemptRegister();
                else
                {
                    logger.fatal("Failed to register TCP server, master might be offline");
                    process.exit(0xE1);
                }
            } else {
                logger.info("Successfully register the TCP server");
            }
        });
    }

    attemptRegister();
});
server.data(onSocketData);

let previous_state;
let csgo_timeout;
let previous_enabled = false;
let previous_globals_enabled = false;

csgo.server.start(function(d) {
    if(globals !== undefined && globals.csgo_enabled) {
        previous_globals_enabled = true;
        const json = JSON.parse(d);
        if((json.player === undefined || json.player.activity === "menu")) {
            if(previous_enabled)
                handleJson({type: "csgo_enabled", data: false});
            previous_enabled = false;
            return;
        }
        if(previous_enabled === false)
            handleJson({type: "csgo_enabled", data: true});
        previous_enabled = true;
        clearTimeout(csgo_timeout);
        csgo_timeout = setTimeout(() => {
            previous_enabled = false;
            handleJson({type: "csgo_enabled", data: false});
        }, 2500);
        try {
            let bin = csgo.export.jsonToBin(json);
            if(previous_state === undefined || !previous_state.every(function(u, i) {
                    return u === bin[i];
                })) {
                handleJson({type: "csgo_new_state", data: bin});
                previous_state = bin;
            }
        }
        catch(e) {
            logger.warn(e);
        }
    } else if(previous_globals_enabled && globals.csgo_enabled === false) {
        previous_globals_enabled = false;
        previous_enabled = false;
        handleJson({type: "csgo_enabled", data: false});
    }
});

let callback_stack = [];
let length_stack = [];
let buffer = new Buffer([]);

function handleBuffer(b) {
    if(callback_stack.length > 0) {
        buffer = Buffer.concat([buffer, b]);
        let expected_length = length_stack[length_stack.length - 1];
        if(buffer.length === expected_length) {
            length_stack.pop();
            const callback = callback_stack.pop();
            callback(null, buffer);
            buffer = new Buffer([]);
        } else if(buffer.length > expected_length) {
            length_stack.pop();
            const callback = callback_stack.pop();
            callback(null, buffer.slice(0, expected_length));
            handleBuffer(buffer.slice(expected_length));
            buffer = new Buffer([]);
        } else {
            logger.debug("Buffer not long enough, expected: " + expected_length + ", got: " + buffer.length);
        }
    } else {
        defaultCallback(b)
    }
}

port.on("data", handleBuffer);

function sendToPort(data, length, callback) {
    logger.debug("Sending "+data.length+" bytes of data");
    if(typeof length === "function") {
        callback = length;
        length = 1;
    }
    if(typeof length === "undefined") {
        length = 1;
    }
    if(callback === undefined) {
        port.write(data);
    } else {
        port.write(data, function(err) {
            if(err) {
                callback_stack.splice(callback_stack.indexOf(callback), 1);
                length_stack.splice(length_stack.indexOf(length), 1);
                callback(err);
            }
        });
        callback_stack.unshift(callback);
        length_stack.unshift(length);
    }
}

function defaultCallback(buffer) {
    if(buffer.length === 1) {
        switch(buffer[0]) {
            case codes.UART_READY: {
                logger.info("Device initialized, ready to accept instructions");
                sending = false;
                if(action_buffer.length > 0) {
                    handleJson(action_buffer.pop());
                }
                break;
            }
            case codes.GLOBALS_UPDATED: {
                sendToPort([codes.SEND_GLOBALS], 22, newGlobals);
                break;
            }
            case codes.END_DEMO: {
                logger.info("Demo finished playing");
                if(audio !== undefined && audio !== null && typeof audio.kill === "function") {
                    audio.kill();
                }
                demo_playing = false;
                break;
            }
            default: {
                logger.warn("Unknown code: ", buffer[0].toString(16));
            }
        }
    } else {
        logger.warn("Unhandled data: ", buffer);
    }
}

function newGlobals(err, buffer) {
    if(err === null) {
        logger.info("Got new globals");
        let globals = effects.export.binToGlobals(buffer);
        http.sendGlobals({
            current_profile: globals.current_profile,
            enabled: globals.leds_enabled
        }, (err, resp, content) => {
            if(err !== null) logger.error(err);
            else logger.trace(content);
        });
        logger.trace(globals);
    } else {
        logger.error(err);
    }
}

function sendGlobals(globals, callback) {
    if(sending) {
        logger.warn("sendGlobals: Device is not done processing or receiving the data");
        return;
    }
    sending = true;
    if(callback === undefined) {
        callback = didReceive;
    }
    sendToPort([codes.SAVE_GLOBALS], (err, data) => {
        if(err !== null) {
            logger.error(err);
        } else if(data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) {
            logger.error("sendGlobals: Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data);
            sending = false;
        } else {
            let bin = effects.export.globalsToBin(globals);
            sendToPort(bin, callback);
        }
    })
}

function sendTempDevice(n, device, callback) {
    if(sending) {
        logger.warn("sendTempDevice: Device is not done processing or receiving the data");
        return;
    }
    sending = true;
    if(callback === undefined) {
        callback = didReceive;
    }
    sendToPort([codes.TEMP_DEVICE], (err, data) => {
        if(err !== null) {
            logger.error(err);
        } else if(data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) {
            logger.error("sendTempDevice: Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data);
            sending = false;
        } else {
            sendToPort(effects.export.deviceToBin(0, n, device), callback);
        }
    })
}

function sendProfile(n, profile, callback) {
    if(typeof profile.devices !== "object") {
        logger.error("sendProfile: Invalid profile object");
    }
    if(sending) {
        logger.warn("sendProfile: Device is not done processing or receiving the data");
        return;
    }
    if(callback === undefined) {
        callback = didReceive;
    }
    let devices = profile.devices.length;
    let current = 0;

    function sendSingle(err, data, override = false) {
        if(err !== null) {
            logger.error("sendSingle:", err);
        } else if((data === null || data.length > 1 || data[0] !== codes.RECEIVE_SUCCESS) && !override) {
            logger.error("sendSingle: Invalid response, expected RECEIVE_SUCCESS (0xA1) got: ", data);
            sending = false;
        } else if(!override) {
            logger.trace("sendSingle: Device successfully received the data");
        }
        sendToPort([codes.SAVE_PROFILE], (err, data) => {
            if(err !== null && !override) {
                logger.error("sendSingle:", err);
            } else if((data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) && !override) {
                logger.error("sendSingle: Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data);
                sending = false;
            } else {
                let c = current + 1 < devices ? sendSingle : callback;
                sendToPort(effects.export.deviceToBin(n, current, profile.devices[current]), c);
                logger.trace("Sending " + current + " device to " + n + " profile");
                current++;
            }
        });
    }

    sendProfileFlags(n, profile.flags, (err, data) => {
        if(err !== null) {
            logger.error("sendProfile:", err);
        } else if(data.length > 1 || data[0] !== codes.RECEIVE_SUCCESS) {
            sending = false;
            logger.error("sendProfile: Invalid response, expected RECEIVE_SUCCESS (0xA1) got: ", data);
        } else {
            sending = false;
            if(action_buffer.length > 0) {
                handleJson(action_buffer.pop());
            }
            logger.trace("sendProfile: Device successfully received the data");
            sending = true;
            sendSingle(null, null, true);
        }
    });
}

function sendProfileFlags(n, flags, callback) {
    if(sending) {
        logger.warn("sendProfileFlags: Device is not done processing or receiving the data");
        return;
    }
    sending = true;
    if(callback === undefined) {
        callback = didReceive;
    }
    sendToPort([codes.SAVE_PROFILE_FLAGS], (err, data) => {
        if(err !== null) {
            logger.error(err);
        } else if(data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) {
            logger.error("sendProfileFlags: Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data);
            sending = false;
        } else {
            sendToPort(new Uint8Array([n, flags]), callback);
        }
    });
}

function saveExplicit(callback) {
    if(sending) {
        logger.warn("saveExplicit: Device is not done processing or receiving the data");
        return;
    }
    sending = true;
    if(callback === undefined) {
        callback = didReceive;
    }
    sendToPort([codes.SAVE_EXPLICIT], callback);
}

function sendCsgo(state, callback) {
    if(sending) {
        logger.warn("sendCsgo: Device is not done processing or receiving the data");
        return;
    }
    sending = true;
    if(callback === undefined) {
        callback = didReceive;
    }
    sendToPort([codes.CSGO_NEW_STATE], (err, data) => {
        if(err !== null) {
            logger.error(err);
        } else if(data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) {
            logger.error("sendCsgo: Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data);
            sending = false;
        } else {
            sendToPort(state, callback);
        }
    })
}

function sendCsgoEnabled(enabled, callback) {
    if(sending) {
        logger.warn("sendCsgo: Device is not done processing or receiving the data");
        return;
    }
    sending = true;
    if(callback === undefined) {
        callback = didReceive;
    }
    sendToPort([enabled ? codes.CSGO_BEGIN : codes.CSGO_END], callback);
}

function didReceive(err, data) {
    if(err !== null) {
        logger.error("didReceive:", err);
    } else if(data.length > 1 || data[0] !== codes.RECEIVE_SUCCESS) {
        sending = false;
        logger.error("didReceive: Invalid response, expected RECEIVE_SUCCESS (0xA1) got: ", data);
    } else {
        sending = false;
        if(action_buffer.length > 0) {
            handleJson(action_buffer.pop());
        }
        logger.trace("didReceive: Device successfully received the data");
    }
}

function onSocketData(buffer) {
    try {
        const json = JSON.parse(buffer.toString("utf-8"));
        handleJson(json);
    } catch(e) {
        logger.error(e);
    }
}

function handleJson(json) {
    logger.trace(json);
    if(sending) {
        logger.debug("Device busy, buffering");
        action_buffer.unshift(json);
    } else {
        switch(json.type) {
            case "dialogflow": {
                switch(json.data.result.action) {
                    case "start-demo": {
                        playDemo(codes.START_DEMO_MUSIC);
                    }
                }
                break;
            }
            case "globals_update": {
                sendGlobals(json.data);
                globals = json.data;
                break;
            }
            case "profile_update": {
                sendProfile(json.options.n, json.data);
                break;
            }
            case "profile_flags": {
                sendProfileFlags(json.options.n, json.data);
                break;
            }
            case "save_explicit": {
                saveExplicit();
                break;
            }
            case "csgo_enabled": {
                sendCsgoEnabled(json.data);
                break;
            }
            case "csgo_new_state": {
                sendCsgo(json.data);
                break;
            }
        }
    }
}

async function playDemo(demo) {
    if(demo_playing) {
        logger.warn("Demo already playing");
        return;
    }
    logger.info("Starting demo:", demo);
    sendToPort([demo], didReceive);
    demo_playing = true;
    if(demo === codes.START_DEMO_MUSIC) {
        audio = player.play("demo.aac", {mplayer: ['-ss', 75]}, function(err) {
            if(err) logger.error(err);
        });
    }
}