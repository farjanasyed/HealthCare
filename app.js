var express=require('express');
var path=require('path');
var bodyParser=require('body-parser');
var cors=require('cors');
var passport =require('passport');
var mongoose=require('mongoose');
var users=require('./routes/users');
var config=require('./config/database');
var multer=require('multer');
var uploads=multer({dest:'/uploads'});
var app=express();
const port=process.env.PORT || 8080;
app.use(cors());
mongoose.connect(config.database);

mongoose.connection.on("connected",function(){
    console.log("connected");
})
app.use(bodyParser.json());


//Passport Middleware

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use(express.static(path.join(__dirname,'public')));

app.use('/users',users);

app.listen(port,function(){
    console.log("listening")
})