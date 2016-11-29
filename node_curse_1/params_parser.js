function parse(req){
  var arreglo_parametros;
  var parametros={};
  if(req.url.indexOf("?") > 0){
    // /?nombre=Uriel => ['/','nombre=Uriel']
    var url_data = req.url.split("?");
    arreglo_parametros = url_data[1].split("&");
    //[nombre=uriel]
  }

  for(var i= arreglo_parametros.length - 1; i >= 0; i--){
    var parametro = arreglo_parametros[i];
    //nombre = Uriel
    var param_data = parametro.split("=");
    //[nombre,Uriel]
    parametros[param_data[0]]=[param_data[1]];
    //{nombre: Uriel}
  }


  return parametros;
}

module.exports.parse = parse;
