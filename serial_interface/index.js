const interface = require("./port");

const codes = {
    SAVE_GLOBALS: 0x10,
    SAVE_PROFILE: 0x11,
    TEMP_DEVICE: 0x12,

    SEND_GLOBALS: 0x20,
    SEND_PROFILE: 0x21,

    READY_TO_RECEIVE: 0xA0,
    RECEIVE_SUCCESS: 0xA1,
    UART_READY: 0xA2,

    GLOBALS_UPDATED: 0xB0,

    START_DEMO: 0xD0,

    UNRECOGNIZED_COMMAND: 0xE0,
    BUFFER_OVERFLOW: 0xE1
};

module.exports = interface;
module.exports.codes = codes;