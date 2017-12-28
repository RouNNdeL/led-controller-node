const net = require("net");
const logger = require("log4js").getLogger();
const op = require('openport');

const listeners = [];

/**
 * @type Server
 */
const server = net.createServer(/** @type Socket*/socket => {
    logger.trace("Client connected");
    socket.on("data", buffer => {
        for(let i = 0; i < listeners.length; i++) {
            listeners[i](buffer);
        }
    });
});

function listen(port, address, callback) {
    if(typeof port === "function") {
        callback = port;
        port = undefined;
    }
    if(typeof address === "function") {
        callback = address;
        address = undefined;
    }
    
    server.listen(port, address, () => {
        logger.info("TCP server listening on: ", server.address());
        if(callback !== undefined) {
            callback();
        }
    });
}

function setListener(f) {
    listeners.push(f);
}

function address() {
    return server.address();
}

module.exports.listen = listen;
module.exports.address = address;
module.exports.data = setListener;