var http = require("http");
var fs = require("fs");
var parser = require("./params_parser.js");
var render = require("./render_view.js");

var p = parser.parse;
var render = render.render;

//var html = fs.readFileSync("./index.html");//Version Sincrona

http.createServer(function(req,res){

  if(req.url.indexOf("favicon.ico") > 0 ){ return; }

  console.log("=====\n\n");
  console.log(req);
  console.log("=====\n\n");

  fs.readFile("./index.html",function(err,html){//Version Asincrona


    res.writeHead(200,{"Content-Type":"text/html"});
    //res.write(html_string);
    res.write(render(html,p,req));
    res.end();
  });
}).listen(8181);
