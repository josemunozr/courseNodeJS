var express = require("express");
var Imagen  = require("./models/imagenes");
var router  = express.Router();
var fs      = require("fs");
var redis   = require("redis");

var client = redis.createClient();

var image_finder_middleware = require("./middlewares/find_image");

router.get("/",function(req,res){//con esto se define que todas las rutas quedan motadas en "/app"
  Imagen.find({})
    .populate("creator")
    .exec(function(err,imagenes){
      if(err) console.log(err);
      res.render("app/home",{imagenes: imagenes});
    })

});

/* REST //Lo principal es el recurso */
/* CRUD */

router.get("/imagenes/new",function(req,res){
  res.render("/app/imagenes/new");
});

router.all("/imagenes/:id*",image_finder_middleware);

router.get("/imagenes/:id/edit",function(req,res){
  res.render("app/imagenes/edit");
});

router.route("/imagenes/:id")
  .get(function(req,res){
    res.redirect("/app/imagenes/show");
  })
  .put(function(req,res){
    res.locals.imagen.title = req.body.title;
    res.locals.imagen.save(function(err){
      if(!err){
        res.redirect("app/imagenes/show");
      }else{
        res.redirect("app/imagenes/"+req.params.id+"/edit");
      }
    });
  })
  .delete(function(req,res){

    //Eliminar las imagenes
    Imagen.findOneAndRemove({_id: req.params.id},function(err){
      if(!err){
        res.redirect("/app/imagenes");
      }else{
        console.log(err);
        res.redirect("/app/imagenes/"+req.params.id);
      }
    });

  });

router.route("/imagenes")
  .get(function(req,res){
    Imagen.find({creator: res.locals.user._id},function(err,imagenes){
      if(err){ res.redirect("/app");return; }
      res.render("app/imagenes/index",{imagenes: imagenes});
    });
  })
  .post(function(req,res){
    var extension = req.body.archivo.name.split(".").pop();
    var data = {
      title: req.body.title,
      creator: res.locals.user._id,
      extension: extension
    }
    var imagen = new Imagen(data);
    imagen.save(function(err){
      if(!err){


        var imgJSON = {
          "id": image._id,
          "title": imagen.title,
          "extension": imagen.extension
        }

        client.publish("images",JSON.stringify(imgJSON));
        fs.rename(req.body.archivo.path, "public/imagenes/"+imagen._id+"."+extension);
        res.redirect("/app/imagenes/"+imagen._id);
      }
      else {
        console.log(imagen);
        res.render(err);
      }
    });

  });

module.exports = router;
