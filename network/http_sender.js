const request = require("request");
const fs = require("fs");
const token = JSON.parse(fs.readFileSync(__dirname + "/../secure.json")).checkin_token;

function register(hostname, port, callback) {
    request("https://home.zdul.xyz/api/device_conn_update.php", {
        method: "POST",
        json:{
            device_id: "pc",
            device_hostname: hostname,
            device_port: port
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