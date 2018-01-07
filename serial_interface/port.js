const SerialPort = require("serialport");
const util = require('util');

function begin(callback) {
    return new SerialPort("COM5", {
        baudRate: 9600
    }, callback);
}

module.exports.begin = begin;