/**
 * Just a simple file server that sends the contents
 * of the public directory to the web browser.
 * 
 * TODO: support different mime-types
 * 
 */
var util = require("util");
var server = require("http");
var fs = require('fs');
var path = require('path');

/**
 * folder locations
 */
var publicFolder = './public';
var htmlFolder = 'html';
var styleFolder = 'style';
var scriptFolder = 'script';

/**
 * create a server
 */
 
server.createServer(function(request,response){  
    
    console.log('request starting...');
     
    var requestURL = request.url;
    
    if( requestURL == '/') requestURL = '/index.html';
    
    // default file path
    var filePath = publicFolder + '/'  + requestURL;
    
         
    var extname = path.extname(requestURL);
    
    var contentType = 'text/html';
    
    filePath = publicFolder + '/' + requestURL;
    
    switch (extname) {
        case '.js':
            
            contentType = 'text/javascript';
            break;
        case '.css':
            
            contentType = 'text/css';
            break;
        default:
            
            break;
    }
    
    console.log("Serving " + filePath);
     
    fs.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
    
}).listen(process.env.PORT);  

util.puts("Server Running on " + process.env.PORT);  

