function render(html,parser,req){
  //body
  var html_string = html.toString();
  var variables = html_string.match(/[^\{\}]+(?=\})/g);//expresion regular que busca en el html donde haya {x}
  var nombre = "";

  var parametros = parser(req);

  for (var i = variables.length-1;i>=0;i--){//lo ejecutamos como codigo de javascript
    //[nombre, apellido]
    var variable = variables[i]
    //parametros[variable[i]]
    //parametros[]
    html_string = html_string.replace("{"+variables[i]+"}",parametros[variable]);//reemplazar el contenido coj llaves {x} por su valor correspondiente
  }
  return html_string;
}

module.exports.render = render;
