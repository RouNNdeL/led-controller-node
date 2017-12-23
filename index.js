const effects = require("./effects");
const port = require("./serial_interface");
const codes = port.codes;
const log4js = require("log4js");
const server = require("./network").receiver;
const register = require("./network").register;

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
        if(err !== null){
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
            if(err) {
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
                break;
            }
            case codes.GLOBALS_UPDATED: {
                sendToPort([codes.SEND_GLOBALS], newGlobals);
                break;
            }
            default: {
                logger.warn("Unknown code: ", buffer[0].toString("hex"));
            }
        }
    } else {
        logger.warn("Unhandled data: ", buffer);
    }
}

function newGlobals(err, buffer) {
    if(err === null) {
        logger.info("Got new globals");
        logger.debug(effects.export.binToGlobals(buffer));
    } else {
        logger.error(err);
    }
}

function sendGlobals(globals, callback) {
    sendToPort([codes.SAVE_GLOBALS], (err, data) => {
        if(err !== null) {
            logger.error(err);
        } else if(data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) {
            logger.error("Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data)
        } else {
            sendToPort(effects.export.globalsToBin(globals), callback);
        }
    })
}

function sendProfile(n, profile, callback) {
    let devices = profile.devices.length;
    let current = 0;

    function sendSingle(err, data, override) {
        sendToPort([codes.SAVE_PROFILE], (err, data) => {
            if(err !== null && !override) {
                logger.error(err);
            } else if((data.length > 1 || data[0] !== codes.READY_TO_RECEIVE) && !override) {
                logger.error("Invalid response, expected READY_TO_RECEIVE (0xA0) got: ", data)
            } else {
                if(current < devices) {
                    sendToPort(effects.export.deviceToBin(n, current, profile.devices[current]), sendSingle);
                    logger.debug("Sending "+current+ " device to "+n+" profile");
                    current++;
                } else {
                    callback();
                }
            }
        });
    }

    sendSingle(null, null, true);
}

function didReceive(err, data) {
    if(err !== null) {
        logger.error(err);
    } else if(data.length > 1 || data[0] !== codes.RECEIVE_SUCCESS) {
        logger.error("Invalid response, expected RECEIVE_SUCCESS (0xA1) got: ", data);
    } else {
        logger.info("Device successfully received the data");
    }
}

function onSocketData(buffer) {
    logger.debug(buffer.toString("utf-8"));
}