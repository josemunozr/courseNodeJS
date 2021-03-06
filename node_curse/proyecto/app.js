var express            = require("express");
var bodyParser         = require("body-parser");
var User               = require("./models/user").User;
var session            = require("express-session");
var router_app         = require("./routes_app");
var session_middleware = require("./middlewares/session");
var formidable         = require("express-formidable");
var RedisStore         = require("connect-redis")(session);
var http               = require("http");
var realtime           = require("./realtime");

var methodOverride     = require("method-override");//middleware que permite usar PUT y DELETE que no son metodos que implementen el navegador

var app = express();
var server = http.Server(app);

var sessionMiddleware = session({
  store: new RedisStore({}),
  secret: "super ultra secret word"
});

realtime(server,sessionMiddleware)

app.use("/public",express.static("public"));//funcion que retorna el middelware necesario que permite servir archivo staticos (imagenes, css, javascript, entre otros que no tienen compilacion de parte del servidor)
//app.use(bodyParser.json());//para perticiones que tengan el formato application/json
//app.use(bodyParser.urlencoded({extended: true}));//define con que hacer el parsing la libreria


app.use(methodOverride("_method"));



app.use(sessionMiddleware);

app.use(formidable());

app.set("view engine","jade");

app.get("/",function(req,res){
  res.render("index");
});

app.get("/signup",function(req,res){
  User.find(function(err,doc){
    
    res.render("signup");
  });
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/users",function(req,res){

    var user = new User({
      email: req.fields.email,
      password: req.fields.password,
      password_confirmation: req.fields.password_confirmation,
      username: req.fields.username
    });

    user.save().then(function(us){
      res.send("Guardamos el usuario exitosamente");
    },function(err){
      console.log(String(err));
      res.send("Hubo un error al guardar el usuario");
    });

});

app.post("/sessions",function(req,res){

  User.findOne({email: req.fields.email, password: req.fields.password},"username email",function(err,user){
    if(err) res.send(String(err));
    if(user) {
      req.session.user_id = user._id;
      res.redirect("/app");
    }else{
      res.send("Usuario o contraseña Incorrectos")
    }
  });

});

app.use("/app",session_middleware);
app.use("/app",router_app);

server.listen(8181, function (){
  console.log("listen at http://localhost:8181");
});
