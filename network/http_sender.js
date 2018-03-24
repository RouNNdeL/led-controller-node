const request = require("request");
const fs = require("fs");
const token = JSON.parse(fs.readFileSync(__dirname + "/../secure.json")).checkin_token;

function register(port, callback) {
    request("http://led/network/checkin.php", {
        method: "GET",
        qs: {
            token: token,
            port: port.toString()
        },
        timeout: 2500
    }, callback);
}

function sendGlobals(data, callback) {
    data.notify = false;
    request("http://led/api/save/global", {
        method: "POST",
        body: data,
        json: true
    }, callback);
}

function sendDebugInfo(data, callback) {
    request("http://led/api/debug/info", {
        method: "POST",
        body: data,
        json: true
    }, callback);
}

module.exports.sendGlobals = sendGlobals;
module.exports.sendDebugInfo = sendDebugInfo;
module.exports.register = register;