const interface = require("./port");

const codes = {
    SAVE_GLOBALS: 0x10,
    SAVE_PROFILE: 0x11,
    TEMP_DEVICE: 0x12,
    SAVE_EXPLICIT: 0x13,

    SEND_GLOBALS: 0x20,
    SEND_PROFILE: 0x21,

    READY_TO_RECEIVE: 0xA0,
    RECEIVE_SUCCESS: 0xA1,
    UART_READY: 0xA2,

    GLOBALS_UPDATED: 0xB0,

    CSGO_BEGIN: 0xC0,
    CSGO_NEW_STATE: 0xC1,

    START_DEMO_MUSIC: 0xD0,
    START_DEMO_EFFECTS: 0xD1,
    END_DEMO: 0xDF,

    UNRECOGNIZED_COMMAND: 0xE0,
    BUFFER_OVERFLOW: 0xE1
};

module.exports = interface;
module.exports.codes = codes;