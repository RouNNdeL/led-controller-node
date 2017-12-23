const effects = require("./effects");
const serial = require("./serial_interface");
const log4js = require("log4js");

log4js.configure({
    appenders: {
        out: {type: 'stdout'}
    },
    categories: {
        default: {appenders: ['out'], level: 'debug'}
    }
});
const logger = log4js.getLogger();

let next_data;
let receive_globals = false;

serial.registerReader(function (d) {
    if (d.length === 0) {
        switch (d[0]) {
            case serial.codes.UART_READY: {
                //Device has been initialized and is ready to accept instructions
                logger.info("LED Controller has been initialized and is ready to accept instructions");
                break;
            }
            case serial.codes.READY_TO_RECEIVE: {
                serial.sendData(next_data);
                break;
            }
            case serial.codes.GLOBALS_UPDATED: {
                serial.sendData([serial.codes.SEND_GLOBALS]);
                receive_globals = true;
                break;
            }
            default: {
                logger.error("Invalid response: ", d[0]);
            }

        }
    } else if(receive_globals) {
        //Send the updated globals to the server
    }
});