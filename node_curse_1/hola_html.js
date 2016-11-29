var http = require("http");
var fs = require("fs");

//var html = fs.readFileSync("./index.html");//Version Sincrona

http.createServer(function(req,res){
  fs.readFile("./index.html",function(err,html){//Version Asincrona
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(html);
    res.end();
  });
}).listen(8181);
