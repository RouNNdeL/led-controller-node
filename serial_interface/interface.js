const SerialPort = require("serialport");
const util = require('util');

const port = new SerialPort("COM5", {
    baudRate: 9600
});

function sendData(data, callback) {
    port.write(data, callback);
}

function registerReader(callback) {
    port.on('readable', function () {
        callback(port.read());
    });
}

module.exports.sendData = sendData;
module.exports.registerReader = registerReader;