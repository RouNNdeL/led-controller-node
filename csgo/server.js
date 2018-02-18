const http = require("http");

const PORT = 14679;

let listener;

function start(callback) {
    listener = callback;
    const server = http.createServer(request);
    server.listen(PORT);
}

function request(req, res) {
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "text/html"});

        let buffer = new Buffer("");
        req.on("data", function (data) {
            buffer = Buffer.concat([buffer, data]);
        });
        req.on("end", function () {
            res.end("");
            listener(buffer.toString("utf-8"));
        });
    }
    else
    {
        res.writeHead(400);
        res.end("");
    }
}

module.exports.start = start;