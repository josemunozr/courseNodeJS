var http = require("http");
var fs = require("fs");

//var html = fs.readFileSync("./index.html");//Version Sincrona

http.createServer(function(req,res){
  fs.readFile("./index.html",function(err,html){//Version Asincrona
    var html_string = html.toString();
    //expresion regular que busca en el html donde haya {x}
    var variables = html_string.match(/[^\{\}]+(?=\})/g);
    var nombre = "Codigo Facilito";

    //variables ['nombre']
    for (var i = variables.length-1;i>=0;i--){
      //lo ejecutamos como codigo de javascript
      //para obtener el valor de dicha variable
      var value = eval(variables[i]);

      //reemplazar el contenido coj llaves {x} por su valor correspondiente
      html_string = html_string.replace("{"+variables[i]+"}",value);
    }

    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(html_string);
    res.end();
  });
}).listen(8181);
