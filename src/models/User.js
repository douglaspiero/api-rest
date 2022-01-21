var bcrypt = require('bcrypt');
var knex = require("../database/connection");
//var passwordToken = require('./passwordToken');


class User {

    async findAllUsers() {
        try {
          var result = await knex.select(["id","name","email","role"]).table("users");
          return result;  
        } catch (error) {
            console.log("Error: " + error);
            return [];
        }
    }


    async findById(id) {
        try {
          var result = await knex.select(["id","name","email","role"]).where({ id: id}).table("users");
          if(result.length > 0) {
              return result[0];
          }else{
              return undefined;
          }          
        
        } catch (error) {
            console.log("Error: " + error);
            return [];
        }
    }

    async findByEmail(email) {
        try {
          var result = await knex.select(["id","name","email","password","role"]).where({ email: email}).table("users");
          
          if(result.length > 0) {
              return result[0];
          }else{
              return undefined;
          }          
        
        } catch (error) {
            console.log("Error: " + error);
            return [];
        }
    }

    async newUser(name,email,password) {
        try{
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({name,email, password: hash, role: 0}).table("users");
        }catch(err){
            console.log("Error: " + err);
        }        
    }

    async findEmail(email) {
        try {
            var result = await knex.select("").from("users").where({email: email})
            if(result.length > 0) {
                return true;
            }else{
                return false;
            }            
            console.log(result);
        } catch (error) {
            console.log(error);
            return false;
        }

       
    }

    async updateUser(id,name,email,role) {
        var user = await this.findById(id);       
        if(user !=  undefined) {
            var editUser = {};          
            if(email != undefined) {          
                if(email != user.email) {                                       
                    var result = await this.findEmail(email);
                    if(result == false) {
                        editUser.email = email;                                                   
                    }else{                                         
                        return {status: false, err: "E-mail is already registered."}                     
                    }
                }
            }          
            if(name != undefined) {
                editUser.name = name;     
            }           
            if(role != undefined) {
                editUser.role = role;
            }          

            try {
                await knex.update(editUser).where({id:id}).table("users");
                return {status: true}
                
            } catch (err) {
                 return {status: false, err: err}
                
            }
        }else{
            return {status: false, err: "User does not exist."}
        }
    }


    async deleteUser(id) {
        var user = await this.findById(id);
    if(user != undefined) {
        try {
            await knex.delete().where({id: id}).table("users");
            return {status: true}
        } catch (err) {
            return {status: false,err: err}
        }
    }else{
        return {status: false, err: "User does not exist."}
        } 
    }

    async changePassword(newPassword,id,token) {
        var hashPass = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hashPass}).where({id:id}).table('users');        
    }


    
}

module.exports = new User;