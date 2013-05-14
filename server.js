/**
 * Just a simple file server that sends the contents
 * of the public directory to the web browser.
 * 
 * TODO: support different mime-types
 * 
 */
var util = require("util");
var static_server = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//

// debugging server arguments
var isDebugging = false; 
var server_args = isDebugging ? {cache:false, headers: {"Cache-Control": "no-cache, must-revalidate"}} : {};

var file = new(static_server.Server)('./public', server_args);

util.puts("Starting Static Server on " + process.env.PORT);  

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response, function (err, result) {
            //console.log("Serving " + request);
            if (err) { // There was an error serving the file
                util.puts("[] Error serving " + request.url + " - " + err.message);

                // Respond to the client
                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    });
}).listen(process.env.PORT);  

util.puts("Server Running on " + process.env.PORT);  

