/**
 * Just a simple file server that sends the contents
 * of the public directory to the web browser.
 * 
 * TODO: support different mime-types
 * 
 */
var static_server = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//

// debugging server arguments
var isDebugging = false; 
var server_args = isDebugging ? {cache:false, headers: {"Cache-Control": "no-cache, must-revalidate"}} : {};

var file = new(static_server.Server)('./public', server_args);

console.log("Starting Static Server on " + process.env.PORT);

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response, function (err, result) {
            if (err) {
                console.log("[] Error serving " + request.url + " - " + err.message);
                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    }).resume();
}).listen(process.env.PORT);

console.log("Server Running on " + process.env.PORT);

