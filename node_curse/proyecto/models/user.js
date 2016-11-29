var mongoose = require("mongoose");

var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/fotos");

//Colecciones = tablas
//Documentos = filas
/*
Los tipos de datos que se pueden definir en mongoose son:
                                                          String
                                                          Number
                                                          Date
                                                          Buffer
                                                          Boolean
                                                          Mixed
                                                          Objectid
                                                          Array
*/
var posibles_valores_sex = ["M","F"];
var email_match = [/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,"Coloca un email valido"];

var user_schema = new Schema({
  name: String,
  username: {type: String, required: true, maxlength:[50,"Username muy grande"]},
  password: {
    type: String,
    minlength:[1,"El password es muy corto"],
    validate:{
      validator: function(p){
        return this.password_confirmation == p;
      },
      message: "Las password's no son iguales"
    }
  },
  age: {type: Number, min:[5,"La edad no puede ser menor que 5"], max:[100,"La edad no puede ser mayor que 100"]},
  email: {type: String, required: "El correo es obligatorio", match: email_match},
  date_of_birth: Date,
  sex:{type: String, enum: {values: posibles_valores_sex, message: "Opcion no valida"}}
});

user_schema.virtual("password_confirmation").get(function(){
  return this.p_c;
}).set(function(password){
  this.p_c = password;
});

var User = mongoose.model("User",user_schema);

module.exports.User = User;
