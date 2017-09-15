var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var config=require('../config/database');
var userSchema=mongoose.Schema({
    name:{
        type:String   
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    mobileno:{
        type:Number,
        required:true
    }
});
const User=module.exports=mongoose.model('users',userSchema);

module.exports.getUserById=function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByEmail=function(email,callback){
    var data={
        email:email
    }
    User.findOne(data,callback);
}

module.exports.addUser=function(user,callback){
    let newUser=new User(user);
    bcrypt.hash(newUser.password,10,function(err,hash){
        newUser.password=hash;
       newUser.save(callback);
           
    });
}
module.exports.comparePassword=function(password,hash,callback){
	bcrypt.compare(password,hash,function(err,isMatch){
       console.log(password,hash);
		if(err) throw err;
		else{
			callback(null,isMatch);
		}
	})
}