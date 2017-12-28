const effects = require("./effects");
const port = require("./serial_interface");
const codes = port.codes;
const log4js = require("log4js");
const server = require("./network").receiver;
const register = require("./network").register;
const player = require('play-sound')(opts = {});

let audio;
let demo_playing;
let sending = false;

log4js.configure({
    appenders: {
        out: {type: "stdout"},
        file: {type: "file", filename: "app.log"}
    },
    categories: {
        default: {appenders: ["out", "file"], level: "debug"}
    }
});
const logger = log4js.getLogger();

server.listen(() => {
    register(server.address().port, function(err, resp, content) {
        if(err !== null) {
            logger.error(err);
        }
    });
});
server.data(onSocketData);

let callback_stack = [];

port.on("data", buffer => {
    if(callback_stack.length > 0) {
        const callback = callback_stack.pop();
        callback(null, buffer);
    } else {
        defaultCallback(buffer)
    }
});

function sendToPort(data, callback) {
    if(callback === undefined) {
        port.write(data);
    } else {
        port.write(data, function(err) {
            if(err !== null) {
                callback_stack.splice(callback_stack.indexOf(callback), 1);
                callback(err);
            }
        });
        callback_stack.unshift(callback);
    }
}

function defaultCallback(buffer) {
    if(buffer.length === 1) {
        switch(buffer[0]) {
            case codes.UART_READY: {
                logger.info("Device initialized, ready to accept instructions");
                //playDemo(codes.START_DEMO_EFFECTS);
                sendProfile(1, effects.examples.effects["rainbow"]);
                //sendGlobals(effects.examples.globals);
                break;
            }
            case codes.GLOBALS_UPDATED: {
                sendToPort([codes.SEND_GLOBALS], newGlobals);
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
        logger.trace(effects.export.binToGlobals(buffer));
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
            logger.error("Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data)
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
            logger.error("Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data)
        } else {
            sendToPort(effects.export.deviceToBin(0, n, device), callback);
        }
    })
}

function sendProfile(n, profile, callback) {
    if(sending) {
        logger.warn("sendProfile: Device is not done processing or receiving the data");
        return;
    }
    sending = true;
    if(callback === undefined) {
        callback = didReceive;
    }
    let devices = profile.devices.length;
    let current = 0;

    function sendSingle(err, data, override) {
        sendToPort([codes.SAVE_PROFILE], (err, data) => {
            if(err !== null && !override) {
                logger.error("sendSingle:", err);
            } else if((data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) && !override) {
                logger.error("Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data)
            } else {
                let c = current +1 < devices ? sendSingle : callback;
                sendToPort(effects.export.deviceToBin(n, current, profile.devices[current]), c);
                logger.trace("Sending " + current + " device to " + n + " profile");
                current++;
            }
        });
    }

    sendSingle(null, null, true);
}

function didReceive(err, data) {
    if(err !== null) {
        logger.error("didReceive:", err);
    } else if(data.length > 1 || data[0] !== codes.RECEIVE_SUCCESS) {
        logger.error("Invalid response, expected RECEIVE_SUCCESS (0xA1) got: ", data);
    } else {
        sending = false;
        logger.info("Device successfully received the data");
    }
}

function onSocketData(buffer) {
    try {
        logger.trace(buffer.toString("utf-8"));
        const json = JSON.parse(buffer.toString("utf-8"));
        handleJson(json);
    } catch(e) {
        logger.error(e);
    }
}

function handleJson(json) {
    if(json.type === "dialogflow") {
        switch(json.data.result.action) {
            case "start-demo": {
                playDemo(codes.START_DEMO_MUSIC);
            }
        }
    }
    else if(json.type === "globals_update") {
        sendGlobals(json.data);
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