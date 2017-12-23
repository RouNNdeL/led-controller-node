const interface = require("./interface");

const codes = {
    SAVE_GLOBALS: 0x10,
    SAVE_PROFILE: 0x11,

    SEND_GLOBALS: 0x20,
    SEND_PROFILE: 0x21,

    READY_TO_RECEIVE: 0xA0,
    RECEIVE_SUCCESS: 0xA1,
    UART_READY: 0xA2,

    GLOBALS_UPDATED: 0xB0,

    UNRECOGNIZED_COMMAND: 0xE0,
    BUFFER_OVERFLOW: 0xE1
};

module.exports = interface;
module.exports.codes = codes;