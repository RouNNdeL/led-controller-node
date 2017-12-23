const SerialPort = require("serialport");
const util = require('util');

const port = new SerialPort("COM5", {
    baudRate: 9600
});

module.exports = port;