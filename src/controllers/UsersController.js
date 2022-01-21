require('dotenv').config();
var User = require("../models/User")
var Password_token = require('../models/passwordToken');
var jwt = require('jsonwebtoken');
var secret = process.env.SECRET;
var bcrypt = require('bcrypt');

class UserController {

    async index(req,res){
        var users = await User.findAllUsers();
        res.json(users);
    }

    async findUser(req,res) {
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined) {
            res.status(404);
            res.json({});
        }else{
            res.status(200);
            res.json(user);
        }
    }

    async createUser(req,res) {
        var {name,email,password} = req.body;
        console.table([name,email,password]);
        if(!email) {
            res.status(403);
            res.json({err: 'The E-mail is invalid !'});
            return;
        }
        var emailExists = await User.findEmail(email);
        if(emailExists) {
            res.status(406);
            res.json({err: "E-mail already exists !"})
            return;
        }
        await User.newUser(name,email,password);
        res.status(200);
        res.send("User created successfully.");
    }

    async ediUser(req,res) {
        var {id,name,email,role} = req.body;
        var result = await User.updateUser(id,name,email,role);
        if(result != undefined) {
            if(result.status) {
                res.status(200);
                res.send("Updated User.")
            }else{
                res.status(406);
                res.send(result.err);
            }
        }else{
                res.status(406);
                res.send("Server error.")
        }
    }

    async deleteUser(req,res) {
        var id = req.params.id;
        console.log(id);
        var result = await User.deleteUser(id);
    if(result.status) {
        res.status(200);
        res.send("User successfully deleted.")
    }else{
        res.status(406);
        res.send(result.err);
        }    
    }

    async recoverPassword(req, res) {
        var email = req.body.email;
        var result = await Password_token.create(email);
     if(result.status) {
        res.status(200);
        res.send(result.token);
        //NodeMailer.send();
        }else{
            res.status(406);
            res.send("" + result.err);
        }   
    }

    async changePassword(req, res) {
        var token = req.body.token;
        var password = req.body.password;      
        var isTokenValid = await Password_token.validateToken(token);
        if(isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Password change success.");
            await Password_token.setIsedToken(token);
        }else{
            res.status(406);
            res.send("Token Invalid.")
        }
    }


    async login(req, res) {
        var {email,password} = req.body;
        var user = await User.findByEmail(email);     
        if(user != undefined) {
          var result = await bcrypt.compare(password,user.password);
        if(result) {
            var token = jwt.sign({email: email, role: user.role}, secret);
            res.status(200);
            res.json({token: token});
        }else{
            res.status(406);
            res.send("Password incorrect.")
        }  
          
          
          res.json({status: result});  
        }else{
          res.json({status: false});  
        }
    }
}

module.exports = new UserController();