// var http = require('http');
// var fs = require('fs');
// var url = require('url');

// http.createServer(function(request,response){
//     //
//     var pathname = url.parse(request.url).pathname;
//     console.log(pathname);
//     fs.readFile(pathname.substr(1),function(err,data){
//         if(err){
//             console.log("404");
//             console.log(err);
//             response.writeHead(404,{'Content-Type':'index/html'});
//             response.setHeader('Content-Type','text/plain');
//         }else{
//             console.log("200");
//             response.writeHead(200,{'Content-Type':'index/html'});
//             response.write(data.toString());
//         }
//         //
//         response.end();
//     });
// }).listen(8080);
// console.log("8080");

// const http = require('http')
// const fs = require('fs')
// http.createServer((req, res) => {
//     console.log(req.headers)
//     //console.log(req.method)
//     //console.log(req.statusCode)
//     //console.log(req.url)
//     if (req.url == '/') {
//         fs.readFile('index.html', { encoding: 'utf-8' }, function(error, data) {
//             if (error) return console.log(error)
//             res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length })
//             res.end(data)
//         })
//     } else {
//         res.writeHead(404)
//         res.end('Wrong Query\n')
//     }
// }).listen("8080")