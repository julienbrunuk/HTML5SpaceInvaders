///<reference path="../../d.ts/node.d.ts" />
var url = require('url'), path = require('path'), http = require('http').createServer(function (request, response) {
    var dest = url.parse(request.url).pathname;
    console.log('url [' + dest + '] requested');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('Hello World');
}).listen(8080);
//# sourceMappingURL=Server.js.map
