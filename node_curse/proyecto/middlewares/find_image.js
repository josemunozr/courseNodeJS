var Imagen = require("../models/imagenes");
var owner_check = require("./image_permition");

module.exports = function(req,res,next){
  Imagen.findById(req.params.id)
    .populate("creator")
    .exec(function(err,imagen){
      if(imagen != null) {
        res.locals.imagen = imagen;
        next();
      }else{
        res.redirect("/app");
      }
    });
}
