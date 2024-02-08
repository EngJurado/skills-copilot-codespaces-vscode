// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');

var server = http.createServer(function(req, res){
    var pathname = url.parse(req.url).pathname;
    if(pathname == '/'){
        pathname = '/index.html';
    }
    if(pathname == '/index.html'){
        fs.readFile(path.join(__dirname, pathname), 'utf-8', function(err, data){
            if(err){
                console.log(err);
                res.end('404 Not Found');
            }else{
                comments.getComments(function(err, comments){
                    if(err){
                        console.log(err);
                        res.end('404 Not Found');
                    }else{
                        var htmlStr = '';
                        for(var i = 0; i < comments.length; i++){
                            htmlStr += '<li>' + comments[i] + '</li>';
                        }
                        data = data.replace('<!-- comments -->', htmlStr);
                        res.end(data);
                    }
                });
            }
        });
    }else if(pathname == '/post'){
        var data = '';
        req.setEncoding('utf-8');
        req.on('data', function(chunk){
            data += chunk;
        });
        req.on('end', function(){
            comments.addComment(data, function(err){
                if(err){
                    console.log(err);
                    res.end('404 Not Found');
                }else{
                    res.end('success');
                }
            });
        });
    }else{
        fs.readFile(path.join(__dirname, pathname), 'utf-8', function(err, data){
            if(err){
                console.log(err);
                res.end('404 Not Found');
            }else{
                res.end(data);
            }
        });
    }
});

server.listen(3000, '